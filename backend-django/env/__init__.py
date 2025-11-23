# dev, uat, prd
ENV = 'dev'

if ENV == 'dev':
    from env.dev_env import *
if ENV == 'uat':
    from env.uat_env import *
if ENV == 'prd':
    from env.prd_env import *


