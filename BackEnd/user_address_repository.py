from base_db_class import db_class
from sqlalchemy.orm import declarative_base
from pydantic import BaseModel
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
from login_repository import login_repo


class address_request(BaseModel):
    login_id: int
    address_part1: str
    address_part2: str
    city: str
    state: int
    nation: str
    pincode: str
    landmark: str


class user_address_repo(db_class):
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

    class states(Base):
        __tablename__ = "states"
        state_id = Column(Integer, primary_key=True, autoincrement=True)
        statename = Column(String(255), nullable=False)

    class UserAddress(Base):
        __tablename__ = "user_address"
        address_id = Column(Integer, primary_key=True, autoincrement=True)
        login_id = Column(Integer, ForeignKey("login.loginid"), nullable=False)
        address_part1 = Column(String(255), nullable=False)
        address_part2 = Column(String(255), nullable=False)
        city = Column(String(50), nullable=False)
        state = Column(Integer, ForeignKey("states.state_id"), nullable=False)
        nation = Column(String(100), nullable=False)
        pincode = Column(String(200), nullable=False)
        landmark = Column(String(100), nullable=False)

    def add_address(self, a: address_request):
        session = self.Session()
        try:
            item = self.UserAddress(
                login_id=a.login_id,
                address_part1=a.address_part1,
                address_part2=a.address_part2,
                city=a.city,
                state=a.state,
                nation=a.nation,
                pincode=a.pincode,
                landmark=a.landmark,
            )
            session.add(item)
            """session.flush()"""
            session.commit()
            login_info = login_repo().get_login_info(a.login_id)
            if login_info and login_info["address"] is None:
                login_repo().update_address(a.login_id, item.address_id)
                print(" Address updated in login")

            print(f" Add item")
        finally:
            session.close()

    def delete_address(self, address_id):
        session = self.Session()
        try:
            address = (
                session.query(self.UserAddress).filter_by(address_id=address_id).first()
            )
            if address:
                session.delete(address)
                session.commit()
            else:
                raise Exception("Address not found")
        finally:
            session.close()

    def get_addresses_by_login(self, login_id):
        session = self.Session()
        try:
            address_all = (
                session.query(self.UserAddress).filter_by(login_id=login_id).all()
            )
            address_list = []
            for address in address_all:
                address_dict = {
                    "address_id": address.address_id,
                    "login_id": address.login_id,
                    "address_part1": address.address_part1,
                    "address_part2": address.address_part2,
                    "city": address.city,
                    "state": address.state,
                    "nation": address.nation,
                    "pincode": address.pincode,
                    "landmark": address.landmark,
                }
                address_list.append(address_dict)
            return address_list
        finally:
            session.close()
