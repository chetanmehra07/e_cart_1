from base_db_class import db_class
from pydantic import BaseModel
from sqlalchemy.orm import declarative_base
from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    Float,
    Boolean,
    ForeignKey,
    Date,
)
from datetime import datetime
from custom_exception import CustomException


class signup_request(BaseModel):
    UserName: str
    first_name: str
    last_name: str
    emailaddress: str
    phoneNo: str
    password: str
    DateOfBirth: str
    gender: str


class login_repo(db_class):
    Base = declarative_base()

    class Login(Base):
        __tablename__ = "login"
        loginid = Column(Integer, primary_key=True, autoincrement=True)
        UserName = Column(String(50), nullable=False, unique=True)
        first_name = Column(String(50), nullable=False)
        last_name = Column(String(50), nullable=False)
        emailaddress = Column(String(100), nullable=False)
        phoneNo = Column(String(15), nullable=False)
        password = Column(String(100), nullable=False)
        DateOfBirth = Column(Date)
        gender = Column(String(10))
        address = Column(Integer, nullable=True)

    def signup(self, a: signup_request):
        session = self.Session()
        try:
            existing_user = (
                session.query(self.Login).filter_by(phoneNo=a.phoneNo).first()
            )
            if existing_user:
                raise CustomException("login already created")
            new_user = self.Login(
                UserName=a.UserName,
                first_name=a.first_name,
                last_name=a.last_name,
                emailaddress=a.emailaddress,
                phoneNo=a.phoneNo,
                password=a.password,
                DateOfBirth=a.DateOfBirth,
                gender=a.gender,
            )
            session.add(new_user)
            session.commit()
            return True
        except Exception as e:
            print(e)
        finally:
            session.close()

    def signin(self, phoneNo, password):
        session = self.Session()
        try:
            user = (
                session.query(self.Login)
                .filter_by(phoneNo=phoneNo, password=password)
                .first()
            )
            if user:
                return {"loginid": user.loginid, "UserName": user.UserName}
            else:
                raise CustomException("Invalid phone number or password")
        finally:
            session.close()


    def get_login_info(self, loginid):
        session = self.Session()
        try:
            existing_user = session.query(self.Login).filter_by(loginid=loginid).first()
            existing_user_dict = {
                "UserName": existing_user.UserName,
                "first_name": existing_user.first_name,
                "last_name": existing_user.last_name,
                "emailaddress": existing_user.emailaddress,
                "phoneNo": existing_user.phoneNo,
                "password": existing_user.password,
                "DateOfBirth": existing_user.DateOfBirth,
                "gender": existing_user.gender,
                "address": existing_user.address,
            }
            return existing_user_dict
        except Exception as e:
            print(e)
        finally:
            session.close()

    def update_address(self, loginid, address_id):
        session = self.Session()
        try:
            existing_user = session.query(self.Login).filter_by(loginid=loginid).first()
            existing_user.address = address_id
            session.add(existing_user)
            session.commit()
            return
        except Exception as e:
            print(e)
        finally:
            session.close()
