from base_db_class import db_class
from pydantic import BaseModel
from sqlalchemy.orm import declarative_base
from buy_history_repository import buy_history_repo
from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    Float,
    Boolean,
    ForeignKey,
    UniqueConstraint,
    Date,
    Text,
)
import random
from datetime import date, timedelta  

class OrderRequest(BaseModel):
    login_id: int
    product_id: int
    quantity: int
    delivery_address: int

class order_repo(db_class):
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

    class Order(Base):
        __tablename__ = 'orders'

        order_id = Column(Integer, primary_key=True, autoincrement=True)
        login_id = Column(Integer, ForeignKey('login.loginid', ondelete='CASCADE'), nullable=False)
        product_id = Column(Integer, ForeignKey('list_items.product_id', ondelete='CASCADE'), nullable=False)
        order_date = Column(Date, nullable=False, default=date.today)
        delivery_date = Column(Date, nullable=False)
        quantity = Column(Integer, nullable=False)
        total_price = Column(Float, nullable=False)
        delivery_address = Column(Integer, ForeignKey('user_address.address_id', ondelete='CASCADE'), nullable=False)
    
    def order_item(self, a:OrderRequest):
        session = self.Session()
        try:
            product = session.query(self.ListItem).filter_by(product_id=a.product_id).first()
            if not product:
                raise ValueError("Product not available.")

            total_price = product.MRP * (a.quantity)
            order_date = date.today()
            delivery_days = random.choice([2, 3, 4])
            delivery_date = order_date + timedelta(days=delivery_days)

            new_order = self.Order(
                login_id=a.login_id,
                product_id=a.product_id,
                order_date=order_date,
                delivery_date=delivery_date,
                quantity=a.quantity,
                total_price=total_price,
                delivery_address=a.delivery_address
            )

            session.add(new_order)
            session.commit()
            return {"message": "Order placed successfully", "order_id": new_order.order_id}
        except Exception as e:
            print(e)
        finally:
            session.close()


    def update_and_get_user_orders(self, login_id: int):
        session = self.Session()
        history_repo=buy_history_repo()

        try:
            today = date.today()

            user_orders = session.query(self.Order).filter_by(login_id=login_id).all()
            active_orders = []

            for order in user_orders:
                if order.delivery_date < today:
                    history_repo.add_buy_history(
                        login_id=order.login_id,
                        product_id=order.product_id,
                        delivared_address=order.delivery_address  
                    )
                    session.delete(order)
                else:
                    active_orders.append(order)

            session.commit()

            return [{
                "order_id": o.order_id,
                "product_id": o.product_id,
                "order_date": o.order_date,
                "delivery_date": o.delivery_date,
                "quantity": o.quantity,
                "total_price": o.total_price,
                "delivery_address": o.delivery_address
            } for o in active_orders]

        except Exception as e:
            print(e)
            return []
        finally:
            session.close()