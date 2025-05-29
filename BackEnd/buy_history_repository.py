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
from datetime import date
from custom_exception import CustomException
from login_repository import login_repo
from user_address_repository import user_address_repo
from itemrepository import item_repo


class buy_history_repo(db_class):
    Base = declarative_base()

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

    class ListItem(Base):
        __tablename__ = "list_items"

        product_id = Column(Integer, primary_key=True, autoincrement=True)
        product_name = Column(String(100), nullable=False)
        MRP = Column(Float, nullable=False)
        discount = Column(Float)
        stock_avl = Column(Integer)
        free_delivery_status = Column(Boolean, nullable=False)
        item_category = Column(
            Integer, ForeignKey("category.category_id"), nullable=False
        )
        product_image = Column(String(100), nullable=False)
        applicable_policies = Column(String(250), nullable=False)
        specs = Column(String(100), nullable=False)

    class BuyHistory(Base):
        __tablename__ = "buy_history"

        buy_id = Column(Integer, primary_key=True, autoincrement=True)
        login_id = Column(
            Integer, ForeignKey("login.loginid", ondelete="CASCADE"), nullable=False
        )
        product_id = Column(
            Integer,
            ForeignKey("list_items.product_id", ondelete="CASCADE"),
            nullable=False,
        )
        buy_date = Column(Date, nullable=False)
        delivared_address = Column(
            Integer,
            ForeignKey("user_address.address_id", ondelete="CASCADE"),
            nullable=False,
        )

    def add_buy_history(self, login_id: int, product_id: int, delivared_address: int):
        session = self.Session()
        try:
            new_purchase = self.BuyHistory(
                login_id=login_id,
                product_id=product_id,
                buy_date=date.today(),
                delivared_address=delivared_address,
            )
            session.add(new_purchase)
            session.commit()
            print("item sucessfully bought")
            return True
        except Exception as e:
            print(e)
        finally:
            session.close()

    def delete_buy_item(self, login_id):
        session = self.Session()
        try:
            bought_item = (
                session.query(self.BuyHistory).filter_by(login_id=login_id).first()
            )
            if bought_item:
                session.delete(bought_item)
                session.commit()
            else:
                raise Exception("no item in buy history")
        finally:
            session.close()

    def get_buy_history(self, login_id):
        session = self.Session()
        try:
            history_all = (
                session.query(self.BuyHistory).filter_by(login_id=login_id).all()
            )
            if history_all:
                history_list = []
                for history in history_all:
                    history_dict = {
                        "buy_id": history.buy_id,
                        "login_id": history.login_id,
                        "product_id": history.product_id,
                        "buy_date": history.buy_date,
                        "delivared_address": history.delivared_address,
                    }
                    history_list.append(history_dict)
                return history_list
            else:
                print("no item in buy history")
        except Exception as e:
            print(e)
        finally:
            session.close()
