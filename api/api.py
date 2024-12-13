import os
import mariadb
import sys
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from flask_jwt_extended import (
    JWTManager,
    jwt_required,
    create_access_token,
)
from flask_bcrypt import Bcrypt

load_dotenv()

MARIADB_USER = os.getenv("MARIADB_USER")
MARIADB_PASSWD = os.getenv("MARIADB_PASSWD")
MARIADB_HOST = os.getenv("MARIADB_HOST")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
MARIADB_PORT = 3306

app = Flask(__name__)

app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY
jwt = JWTManager(app)
bcrypt = Bcrypt(app)
CORS(app)

# hash = bcrypt.generate_password_hash("1234")
# print(hash)


@app.route("/login", methods=["POST"])
def login():
    if request.json is None:
        return jsonify({"msg": "Bad username or password"}), 401
    reqUsername = request.json.get("username", None)
    reqPassword = request.json.get("password", None)
    try:
        output_conn = mariadb.connect(
            user=MARIADB_USER,
            password=MARIADB_PASSWD,
            host=MARIADB_HOST,
            port=MARIADB_PORT,
            database="telcorain_webapp",
        )
    except mariadb.Error as e:
        print(f"Error connecting to MariaDB Platform: {e}")
        sys.exit(1)
    output_cur = output_conn.cursor()
    output_cur.execute(
        """
        SELECT password FROM users WHERE name = ?
        """,
        (reqUsername,),
    )
    if output_cur.rowcount == 0:
        return jsonify({"msg": "User doesn't exist"}), 401
    for password in output_cur:
        if not bcrypt.check_password_hash(password[0], reqPassword):
            return jsonify({"msg": "Bad password"}), 401

    access_token = create_access_token(identity=reqUsername)
    output_cur.close()

    return jsonify(accessToken=access_token, username=reqUsername)


@app.route("/links", methods=["GET"])
@jwt_required()
def get_links():
    try:
        metadata_conn = mariadb.connect(
            user=MARIADB_USER,
            password=MARIADB_PASSWD,
            host=MARIADB_HOST,
            port=MARIADB_PORT,
            database="cml_metadata",
        )
    except mariadb.Error as e:
        print(f"Error connecting to MariaDB Platform: {e}")
        sys.exit(1)
    metadata_cur = metadata_conn.cursor()
    metadata_cur.execute(
        """SELECT links.ID, links.ISP_ID, links.frequency_A, links.frequency_B, links.polarization, links.distance, sites1.X_coordinate, sites1.Y_coordinate, sites2.X_coordinate, sites2.Y_coordinate, technologies.name
        FROM links 
        INNER JOIN sites AS sites1 ON links.site_A = sites1.ID 
        INNER JOIN sites AS sites2 ON links.site_B = sites2.ID
        INNER JOIN technologies ON links.technology = technologies.ID
        WHERE links.is_active = 1"""
    )

    links = []
    for (
        id,
        ips_id,
        freqA,
        freqB,
        polar,
        dist,
        site1_X,
        site1_Y,
        site2_X,
        site2_Y,
        tech,
    ) in metadata_cur:
        links.append(
            {
                "id": id,
                "ipsId": ips_id,
                "freqA": freqA,
                "freqB": freqB,
                "polar": polar,
                "dist": dist,
                "site1": [site1_Y, site1_X],
                "site2": [site2_Y, site2_X],
                "tech": tech,
            }
        )
    metadata_cur.close()
    return links


@app.route("/rain", methods=["POST"])
@jwt_required()
def get_rain():
    req_from, req_to = None, None
    if request.json is not None:
        req_from = request.json["from"]
        req_to = request.json["to"]

    try:
        output_conn = mariadb.connect(
            user=MARIADB_USER,
            password=MARIADB_PASSWD,
            host=MARIADB_HOST,
            port=MARIADB_PORT,
            database="telcorain_output",
        )
    except mariadb.Error as e:
        print(f"Error connecting to MariaDB Platform: {e}")
        sys.exit(1)
    output_cur = output_conn.cursor()
    try:
        rain = []
        output_cur.execute(
            """
            SELECT * FROM (
                SELECT time, image_name FROM realtime_rain_grids WHERE time BETWEEN ? AND ? ORDER BY time DESC
            ) as rain
            ORDER BY time ASC
            """,
            (req_from, req_to),
        )
        for time, img_name in output_cur:
            rain.append({"time": time, "imgName": img_name})
        return rain
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

    finally:
        if output_cur:
            output_cur.close()
