from category_repository import category_repo
from user_address_repository import user_address_repo, address_request
import uvicorn
from fastapi.responses import JSONResponse
from custom_exception import CustomException
from cart_repository import cart_request, cart_repo
from rating_repository import rating_repo
from buy_history_repository import buy_history_repo
from orders_repository import order_repo,OrderRequest
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(swagger_ui_parameters={"syntaxHighlight": False})

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # OR "https" if you're using SSL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers (e.g., Content-Type, Authorization)
)

class CartItem(BaseModel):
    name: str
    price: float
    quantity: int = 1
    is_offer: Union[bool, None] = None


store_items = {
    1: {"name": "Laptop", "price": 75000},
    2: {"name": "Headphones", "price": 2500},
    3: {"name": "Keyboard", "price": 1500},
    4: {"name": "Mouse", "price": 800},
}

cart: Dict[int, Dict] = {}
orders: Dict[int, List[Dict]] = {}
order_id_counter = 1


@app.get("/")
def read_root():
    return {"message": "Welcome to the e-Cart API"}


###########  g  e  t  #################


@app.get("/store")
def get_store_items():
    try:
        item = item_repo().view_all_items()
        return item
    except Exception as e:
        print("Error in /store:", e)
        return JSONResponse({"error": "Something went wrong."}, status_code=500)


@app.get("/store/product/{product_id}")
def get_all_details_of_item(product_id):
    return item_repo().view_all_details_of_item(product_id)