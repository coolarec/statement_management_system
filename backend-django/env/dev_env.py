# ************** 默认数据库 配置  ************** #
# ================================================= #
# 数据库类型 MYSQL/SQLSERVER/SQLITE3/POSTGRESQL
import os

DATABASE_TYPE = "POSTGRESQL"
# 数据库地址
DATABASE_HOST = "hk.fuadmin.cn"
# 数据库端口
DATABASE_PORT = 5323
# 数据库用户名
DATABASE_USER = os.environ.get('DEV_DB_USER', "test")
# 数据库密码
DATABASE_PASSWORD = os.environ.get('DEV_DB_PASSWORD', "123")
# 数据库名
DATABASE_NAME = "zq-admin"

# ================================================= #
# ******** redis配置  *********** #
# ================================================= #
REDIS_PASSWORD = ''
REDIS_HOST = '127.0.0.1'
REDIS_DB = '2'
REDIS_URL = f'redis://:{REDIS_PASSWORD or ""}@{REDIS_HOST}:6379'
# ================================================= #
# ******** 其他配置 *********** #
# ================================================= #
IS_DEMO = False

HOST = "http://localhost:5173/"