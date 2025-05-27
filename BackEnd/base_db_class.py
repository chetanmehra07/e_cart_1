
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy import create_engine



class db_class:
    engine = create_engine("mysql+mysqlconnector://chetan_mysql:Chetan%400711@localhost:3306/e_cart")

    Session = sessionmaker(bind=engine)

    