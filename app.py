from flask import render_template,Flask
# from models.models import UserModel
import mysql.connector,json,os,hashlib
from flask import render_template, request, redirect, url_for,make_response,jsonify,session,g
import math
from datetime import datetime,timedelta,timezone
from flask import render_template, request, redirect
from zoomus import ZoomClient
from flask_socketio import SocketIO, emit

app = Flask(__name__)


# キー、シークレット、ID入れる
API_KEY = 'wZtvmX69Rk-xjGpf_TV8Vw'
API_SECRET = 'XBZ8v0je8hjrNKVGbX1OY5VcwqXREe3sT3gS'
zoom_client = ZoomClient(API_KEY, API_SECRET,api_account_id='nhs20487@nhs.hal.ac.jp')
app.secret_key = "0123456789"  # セッションに使用する秘密鍵を設定
# パスワードをハッシュ化
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

app.config['UPLOAD_FOLDER'] = 'static/images'
app.config['UPLOADED_PHOTOS_DEST'] = 'static/images'  # アップロード先ディレクトリ
app.secret_key="qawsedrftgyhujikolp" 
app.permanent_session_lifetime= timedelta(minutes=60)

# MySQL接続設定
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'P@ssw0rd',
    'database': 'ihdb'
}

def conn_db():
    conn=mysql.connector.connect(
        host="127.0.0.1",
        user="root",
        password="P@ssw0rd",
        db="ihdb",
    )
    return conn 

# チャットメッセージを保存するためのリスト
chat_messages = []
socketio = SocketIO(app)

#ユーザー名の表示
@app.before_request
def before_request():
    # セッションからメールアドレスを取得
    session_email = session.get('email')

    if session_email:
        # データベースからユーザー情報を取得
        conn = conn_db()
        cursor = conn.cursor()
        cursor.execute("SELECT username FROM users WHERE email = %s", (session_email,))
        g.username = cursor.fetchone()[0]  # ユーザーの名前を取得
        cursor.close()
        conn.close()
    else:
        g.username = None  # セッションにメールアドレスがない場合はNoneを設定

# すべてのテンプレートにユーザー名を渡す
@app.context_processor
def inject_username():
    return dict(username=g.username)


# ページの表示
@app.route('/')
def display():
        # ログインしている場合はリダイレクト
    if 'email' in session:
        return redirect(url_for('index'))
    return render_template("login.html")

# ログイン
@app.route("/login", methods=["POST"])
def login():
    email = request.form.get("email")
    password = request.form.get("password")
    # 日本標準時（JST）のタイムゾーンオブジェクトを生成
    jst = timezone(timedelta(hours=9))
    # ロック解除までの時間を計算するため、ロックされている場合はその時間を取得
    locked_until = session.get('locked_until')
    # パスワードをハッシュ化
    hashed_password = hash_password(password)
    # データベースへの接続
    conn = conn_db()
    cursor = conn.cursor()
    # ユーザーの存在を確認（ハッシュ化されたパスワードを使用）
    query = "SELECT * FROM users WHERE email = %s AND password = %s"
    cursor.execute(query, (email, hashed_password))
    user = cursor.fetchone()
    # データベースとの接続を閉じる
    cursor.close()
    conn.close()
    # ログインが失敗した場合
    if not user:
        # セッションに挿入
        session['email'] = email
        # ログイン失敗の処理
        login_attempts = session.get('login_attempts', 0)
        # ログイン失敗回数に応じて処理
        if login_attempts == 2 or login_attempts == 3:
            # 3回目または5回目の失敗の場合
            error_message = f"{login_attempts + 1}回連続でパスワードが違います。"
            session['login_attempts'] = login_attempts + 1
            return render_template("login.html", err=error_message)
        elif login_attempts == 4:
            # 5回目の失敗の場合
            if not locked_until or datetime.now(jst) >= locked_until:
                # アカウントがロックされていないか、ロック解除までの時間が過ぎている場合
                current_datetime = datetime.now(jst)
                locked_until = current_datetime + timedelta(minutes=5)
                session['login_attempts'] = 5
                session['locked_until'] = locked_until
                error_message = "アカウントが5分間ロックされました。"
                return render_template("login.html", err=error_message)
        elif login_attempts >= 5:
            # 6回目の失敗の場合
            if locked_until and datetime.now(jst) < locked_until:
                if session.get('email') == email:
                    current_datetime = datetime.now(jst)
                    locked_until = current_datetime + timedelta(minutes=5)
                    remaining_time = int((locked_until - current_datetime).total_seconds())
                    err = f"アカウントがロックされています。残り時間: {remaining_time}秒"
                    return render_template("login.html", err=err)
        # ログイン失敗回数を更新
        session['login_attempts'] = login_attempts + 1
        err = "無効なメールアドレスまたはパスワードが違います"
        return render_template("login.html", err=err)
    else:
        if locked_until and datetime.now(jst) < locked_until:
            if session.get('email') == email:
                current_datetime = datetime.now(jst)
                locked_until = current_datetime + timedelta(minutes=5)
                remaining_time = int((locked_until - current_datetime).total_seconds())
                err = f"アカウントがロックされています。残り時間: {remaining_time}秒"
                return render_template("login.html", err=err)
        # ログイン成功の処理
        # ログイン成功したので login_attempts をリセット
        session.pop('login_attempts', None)
        session['email'] = user[3]
        return redirect(url_for("index"))
    
# 会員登録
@app.route('/signin', methods=["POST"])
def signin():
    # ログインしている場合はリダイレクト
    if 'email' in session:
        return redirect(url_for('index'))
    name = request.form.get("name")
    email = request.form.get("email")
    password = request.form.get("password")
    aria = request.form.get("aria")
    phonenumber = request.form.get("phonenumber")
    arianame = ""  # 初期化
    if aria == "1":
        arianame = "japan"
    elif aria == "2":
        arianame = "Australia"
    elif aria == "3":
        arianame = "U.K"
    elif aria == "4":
        arianame = "U.A"
    elif aria == "5":
        arianame = "China"
    # パスワードをハッシュ化
    hashed_password = hash_password(password)
    # データベースに接続
    conn = conn_db()
    cursor = conn.cursor()
    # ユーザーが既に存在するか確認
    cursor.execute("SELECT * FROM users WHERE email = %s OR phonenumber = %s", (email, phonenumber))
    existing_user = cursor.fetchone()
    if existing_user:
        # 既に存在する場合はログインページに戻る
        return render_template("login.html", error="このメールアドレスまたは電話番号は既に使われています")
    # 現在の日時を取得
    current_datetime = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    # 新しいユーザーをデータベースに追加
    cursor.execute("INSERT IGNORE INTO area (area_id, area) VALUES (%s, %s)", (aria, arianame))
    cursor.execute("INSERT INTO users (username, email, password,aria_id , created_at, updated_at, phonenumber) VALUES (%s,%s,%s,%s,%s,%s,%s)",(name, email, hashed_password, aria, current_datetime, current_datetime, phonenumber))
    conn.commit()
    # ユーザーIDをセッションに保存
    session['email'] = email
    # データベースとの接続を閉じる
    cursor.close()
    conn.close()
    # 成功時にlogin.htmlにリダイレクト
    return redirect(url_for("display"))

# ログアウト
@app.route('/logout')
def logout():
    # セッションをクリア
    session.clear()
    # ログアウト後の処理（ここではトップページにリダイレクトする例）
    return redirect(url_for('display'))



# トップ
@app.route('/index')
def index():
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    # cursor.execute('SELECT * FROM items WHERE items_id >= 81 ORDER BY RAND() LIMIT 7')
    cursor.execute('SELECT * FROM items WHERE items_id >= 1050 AND stock = 1 ORDER BY RAND() LIMIT 7')
    products = cursor.fetchall()
    connection.close()
    
    return render_template('index.html',products=products)
# def username():
#     # セッションからメールアドレスを取得
#     session_email = session.get('email')

#     # データベースからユーザー情報を取得
#     conn = conn_db()
#     cursor = conn.cursor()
#     cursor.execute("SELECT username FROM users WHERE email = %s", (session_email,))
#     username = cursor.fetchone()[0]  # ユーザーの名前を取得
#     cursor.close()
#     conn.close()
    
#     return render_template("index.html",username=username)


# 検索結果
@app.route('/search' ,methods=['get','post'])
def search():
    if request.method == 'POST':
        search_query = request.form['text']

        # データベースに接続
        conn = conn_db()
        cursor = conn.cursor(dictionary=True)  # 辞書形式で結果を取得する

        # 入力に基づいて商品を検索
        # query = "SELECT * FROM items WHERE name LIKE %s ORDER BY RAND()"
        query = "SELECT * FROM items WHERE name LIKE %s AND items_id >= 1050 ORDER BY RAND()"
        cursor.execute(query, ('%' + search_query + '%',))
        items = cursor.fetchall()

        # リソースを解放して接続を閉じる
        cursor.close()
        conn.close()

        return render_template("search_results.html", items=items, search_query=search_query)
    
    return render_template("search_results.html")
# カテゴリー検索結果（家具キッチン）
@app.route('/ctg_search_01')
def ctg_search_01(): 
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM items WHERE categories_id=1 AND items_id >= 1050  ORDER BY RAND() LIMIT 20")
        items=cursor.fetchall()
        connection.close()
        return render_template('search_results.html',items=items)
# カテゴリー検索結果（ガーデニング＆屋外）
@app.route('/ctg_search_03')
def ctg_search_03(): 
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM items WHERE categories_id=3 AND items_id >= 1050 ORDER BY RAND() LIMIT 20")
        items=cursor.fetchall()
        connection.close()
        return render_template('search_results.html',items=items)
    
# 商品詳細
@app.route('/product_detail/<product_id>')
def product_detail(product_id):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    
    cursor.execute('SELECT * FROM items WHERE items_id = %s', (product_id,))
    # cursor.execute('SELECT * FROM items WHERE items_id = %s AND items_id >= 1000', (product_id,))
    products = cursor.fetchone()
    connection.close()
    return render_template('product_detail.html',products=products)

# カートに追加
@app.route('/add_to_cart/<item_id>', methods=['POST'])
def add_to_cart(item_id):
    if 'cart' not in session:
        session['cart'] = []
    session['cart'].append(item_id)
    
    session['cart_count'] = session.get('cart_count', 0) + 1
    # 00表示のコード（バグる）
    # 現在の 'cart_count' 取得
    # current_count = session.get('cart_count', 0)
    
    # 'cart_count' に1を加えた後、2桁の文字列に変換
    # formatted_count = '{:02}'.format(int(current_count) + 1)
    
    # 'cart_count' を更新
    # session['cart_count'] = current_count
    
    return redirect(url_for('view_cart'))

# カート
@app.route('/view_cart')
def view_cart():
    # カートの商品IDリスト
    cart_items = session.get('cart', [])

    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)

    products = []
    for item_id in cart_items:
        cursor.execute('SELECT * FROM items WHERE items_id = %s', (item_id,))
        product = cursor.fetchone()
        if product:
            products.append(product)
    connection.close()
    return render_template('view_cart.html', products=products)



# 単品購入
@app.route('/purchase_item/<item_id>', methods=['POST'])
def purchase_item(item_id):
    session['purchase_item_id'] = item_id
    
    return redirect(url_for('payment_selection'))


# カート一括購入
@app.route('/purchase_all_cart', methods=['POST'])
def purchase_all_cart():
    cart_items = session.get('cart', [])
    session['purchase_cart_item']=cart_items
    
    return redirect(url_for('payment_selection'))

# カートから削除
@app.route('/del_cart_item/<item_id>',methods=["POST"])
def del_cart_item(item_id):
    cart_items = session.get('cart', [])
    if item_id in cart_items:
        cart_items.remove(item_id)
        session['cart'] = cart_items
    # カート内のアイテムの数を更新
    cart_count = len(cart_items)
    session['cart_count'] = cart_count

    return redirect(url_for('view_cart'))


# チャット
@app.route('/chat/<item_id>')
def chat(item_id):
    item_id=item_id
    # テストコード
    # print(item_id)
    session_email = session.get('email')
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    cursor.execute("SELECT username FROM users WHERE email = %s", (session_email,))
    username = cursor.fetchall()
    user_tuple = username[0]
    username = user_tuple[0]
    item_name=search_item_name(item_id)
    
    return render_template('chat.html',username=username,item_id=item_id,item_name=item_name)

# 商品名取得
def search_item_name(item_id):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    cursor.execute('SELECT name FROM items WHERE items_id = %s', (item_id,))
    product = cursor.fetchone()
    item_name = product[0]
    return item_name



# Socket.IO メッセージ処理
@socketio.on('message')
def handle_message(data):
    session_email = session.get('email')
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    cursor.execute("SELECT username FROM users WHERE email = %s", (session_email,))
    username_tuple = cursor.fetchone()

    if username_tuple:
        username = username_tuple[0]
        product_id = data.get('product_id')
        message = data['message']
        chat_messages.append({'product_id': product_id, 'username': username, 'message': message})
        emit('message', {'username': username, 'message': message}, broadcast=True)

    connection.close()

# Socket.IO リダイレクト処理
@socketio.on('redirectToProductChat')
def handle_redirect_to_product_chat(data):
    product_id = data.get('productId')
    
    redirect_url = url_for('chat', item_id=product_id)
    emit('redirect', {'url': redirect_url})

# 支払方法選択
@app.route('/payment_selection', methods=['GET', 'POST'])
def payment_selection():
    if request.method == 'POST':
        payment_choice = request.form.get('choice')
        # セッションに保存
        session['payment_choice'] = payment_choice
        return redirect('/address_form')
    return render_template('payment_selection.html')

# 配送先入力
@app.route('/address_form', methods=['GET', 'POST'])
def process_address_form():
    if request.method == 'POST':
        postal_code = request.form.get('postal_code')
        region = request.form.get('region')
        locality = request.form.get('locality')
        street_address = request.form.get('street_address')
        extended_address = request.form.get('extended_address')
        # セッションに入れる
        session['postal_code'] = postal_code
        session['region'] = region
        session['locality'] = locality
        session['street_address'] = street_address
        session['extended_address'] = extended_address
        return redirect('/payment_confirmation')
    return render_template('delivery_address_input.html')

# 決済情報確認
@app.route('/payment_confirmation')
def confirmation():
    item_id = session.get('purchase_item_id')
    cart_items = session.get('purchase_cart_item')
    # 単品購入時
    # item_id が None でない場合の処理
    if item_id is not None:
        item_data = get_item_data(item_id)
        item_price_value, one_commission, one_payment = item_price(item_id)
    else:
        item_data = None
        item_price_value = None
        one_commission = None
        one_payment=None
    # 複数購入時
    # cart_items が None でない場合の処理
    if cart_items is not None:
        cart_items_data = get_cart_items(cart_items)
        total_price_value, total_commission,total_payment = total_price(cart_items)
    else:
        cart_items_data = None
        total_price_value = None
        total_commission = None
        total_payment = None

    payment_choice = session.get('payment_choice')
    postal_code = session.get('postal_code')
    region = session.get('region')
    locality = session.get('locality')
    street_address = session.get('street_address')
    extended_address = session.get('extended_address')

    return render_template('payment_confirmation.html', 
                            # 支払方法
                            payment_choice=payment_choice,
                            #単品購入時    
                            item_data=item_data,
                            item_price=item_price_value,
                            one_commission=one_commission,
                            one_payment=one_payment,
                            # 複数購入時
                            cart_items_data=cart_items_data,
                            total_price_value=total_price_value,
                            total_commission=total_commission,
                            total_payment=total_payment,
                            # 配送先情報
                            postal_code=postal_code, 
                            region=region, 
                            locality=locality, 
                            street_address=street_address, 
                            extended_address=extended_address
                            )

# 単品購入時カート内情報取得
def get_item_data(item_id):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    cursor.execute('SELECT * FROM items WHERE items_id = %s', (item_id,))
    item_data = cursor.fetchone()
    connection.close()
    return item_data

# 単品購入時合計金額、合計手数料計算
def item_price(item_id):
    commission=0.05
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    cursor.execute('SELECT * FROM items WHERE items_id = %s', (item_id,))
    item_price = cursor.fetchone()
    connection.close()
    one_price=item_price['price']
    one_commission = int(float(one_price) * commission)
    one_payment = one_price + one_commission
    return one_price,one_commission,one_payment

# 複数購入時カート内情報取得
def get_cart_items(cart_items):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    cart_items_data = []  # 初期化
    for item_id in cart_items:
        cursor.execute('SELECT * FROM items WHERE items_id = %s', (item_id,))
        item_data = cursor.fetchone()
        if item_data:
            cart_items_data.append(item_data)
    connection.close()
    return cart_items_data

# 複数購入時合計金額、合計手数料計算
def total_price(cart_items):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    commission=0.05
    total_price = 0
    total_commission=0
    for item_id in cart_items:
        cursor.execute('SELECT price FROM items WHERE items_id = %s', (item_id,))
        item_price = cursor.fetchone()
        if item_price:
            total_price += item_price['price']
            total_one_commission = int(float(item_price['price']) * commission)
            total_commission+=total_one_commission
            total_payment=total_commission + total_price 
    connection.close()
    return total_price,total_commission,total_payment

# 購入完了
@app.route('/purchase_complete', methods=['POST'])
def purchase_complete():
    item_id = session.get('purchase_item_id')
    cart_items = session.get('purchase_cart_item')
    
    # 日時
    date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    # 出品者情報
    # セッションからメールアドレスを取得
    session_email = session.get('email')
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT users_id FROM users WHERE email = %s", (session_email,))
    user_id_list = cursor.fetchall()
    # エラーハンドリング    
    if user_id_list:
        buyer_id = user_id_list[0]['users_id']
    else:
        print("user_id_list is empty")
        return redirect("/")
    # buyer_id = user_id_list[0]['users_id']
    
    # 1つのアイテムが存在する場合、挿入
    if item_id:
        cursor.execute('INSERT INTO orders (buyer_id, item_id, order_date, created_at, updated_at) VALUES (%s, %s, %s, %s, %s)',
                        (buyer_id, item_id, date, date, date))
        # 商品テーブルの在庫を更新
        cursor.execute('UPDATE items SET stock = stock - 1 WHERE items_id = %s', (item_id,))
        connection.commit()

    # カート内の各アイテムが存在する場合、挿入
    if cart_items:
        for cart_item in cart_items:
            cursor.execute('INSERT INTO orders (buyer_id, item_id, order_date, created_at, updated_at) VALUES (%s, %s, %s, %s, %s)',
                            (buyer_id, cart_item, date, date, date))
                # 商品テーブルの在庫を更新
            cursor.execute('UPDATE items SET stock = stock - 1 WHERE items_id = %s', (cart_item,))
            connection.commit()
            
    # 商品テーブルの在庫を更新
    # cursor.execute('UPDATE items SET stock = stock - 1 WHERE items_id = %s', (item_id,))

    # カートからアイテムを削除と関連への準備
    if 'cart' in session and item_id in session['cart']:
        # カートからアイテム削除
        session['cart'].remove(item_id)
        # カートカウント減少
        session['cart_count'] = session.get('cart_count', 0) - 1
    
    # カートを空にする
    if cart_items:
        # カートを空にする
        if 'cart' in session:
            session.pop('cart')
    # カートのアイテム数をリセット
        session['cart_count'] = 0
    # 購入に関するセッションデータ削除
    keys_to_remove = ['payment_choice', 'card_nominee', 'card_number', 'expiration_date','postal_code', 'region', 'locality', 'street_address', 'extended_address','purchase_item_id','purchase_cart_item']
    for key in keys_to_remove:
        if key in session:
            session.pop(key)
            
    # cursor.execute("SELECT * FROM items ORDER BY RAND() LIMIT 4")
    cursor.execute("SELECT * FROM items where stock = 1 AND items_id >= 1050 ORDER BY RAND() LIMIT 4")
    products = cursor.fetchall()
    cursor.close()
    connection.close()
    return render_template('purchase_complete.html',products=products)




# 出品
@app.route('/add_product', methods=['GET', 'POST'])
def add_product():
    if request.method == 'POST':
        name = request.form['name']
        description = request.form['description']
        # price = float(request.form['price'])
        price = float(''.join(char for char in request.form['price'] if char.isdigit() or char == '.'))
        meeting_date_date = request.form['meeting_date_date']
        meeting_date_time = request.form['meeting_date_time']
        combined_text = f'Meeting Date: {meeting_date_date}, Meeting Time: {meeting_date_time}'
        # 画像アップロード処理
        file=request.files["image"]
        file.save(os.path.join("./static/images/item_img",file.filename))
        image_url=os.path.join("/static/images/item_img",file.filename)

        # 出品者情報
        # セッションからメールアドレスを取得
        session_email = session.get('email')
        
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT users_id FROM users WHERE email = %s", (session_email,))
        user_id_list = cursor.fetchall()
        connection.close()
        # user_id = user_id_list[0]['users_id']
        # エラーハンドリング    
        if user_id_list:
            user_id = user_id_list[0]['users_id']
        else:
            print("user_id_list is empty")
            return redirect("/")
        
        # 日時
        date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        # カテゴリー
        ctg = request.form['option']
        # 在庫
        stock=1
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()
        cursor.execute('INSERT INTO items (name, discription, price, image_url, users_id,meeting_time,created_at,updated_at,categories_id,stock) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)',
            (name, description, price, image_url, user_id,combined_text,date,date,ctg,stock))
        connection.commit()
        connection.close()

        return redirect(url_for('product_upload_complete'))

    return render_template('product_input.html')


# 出品完了
@app.route('/product_upload_complete')
def product_upload_complete():
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    # cursor.execute('SELECT * FROM items')
    cursor.execute('SELECT * FROM items where items_id >= 1000 AND stock=1 ORDER BY RAND() LIMIT 4')
    products = cursor.fetchall()
    
    connection.close()
    return render_template('product_upload_complete.html',products=products)


# プロフィール
@app.route('/profile')
def profile():
    email = session.get('email')
    # データベースからユーザー情報を取得
    conn = conn_db()
    cursor = conn.cursor()
    cursor.execute("SELECT users_id FROM users WHERE email = %s", (email,))
    users_id = cursor.fetchone()[0]  # ユーザーの名前を取得
    cursor.close()
    conn.close()
    # ユーザーIDを使ってプロフィールを取得するクエリを実行する
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM profiles WHERE users_id = %s", (users_id,))
    profile_data = cursor.fetchone()
    cursor.close()
    connection.close()
    # ユーザーが出品した商品を取得
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM items WHERE users_id = %s", (users_id,))
    users_items = cursor.fetchall()
    cursor.close()
    connection.close()
    return render_template('profile.html', profile_data=profile_data,users_items=users_items)

# ページの表示
@app.route('/profile_edit')
def profile_edit():
    return render_template('profile_edit.html')
# プロフィール編集
@app.route('/profile_change', methods=["post"])
def profile_change():
    # 情報回収 
    usersname = request.form.get("usersname")
    bio = request.form.get("bio","")
    profile_movie = ("hogehoge")
    # データベースからユーザー情報を取得
    email = session.get('email')
    conn = conn_db()
    cursor = conn.cursor()
    cursor.execute("SELECT users_id, username FROM users WHERE email = %s", (email,))
    user_data = cursor.fetchone()  # ユーザーのIDと名前を取得
    users_id = user_data[0]
    username = user_data[1]
    cursor.close()
    conn.close()
    # 現在日時
    current_datetime = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    profile_image = ""
    file = request.files["profile_image"]
    if file:
        # 保存先のディレクトリを指定
        upload_folder = os.path.join(app.config['UPLOAD_FOLDER'])
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)
        # ファイルを保存
        file_path = os.path.join(upload_folder, file.filename)
        file.save(file_path)    
        profile_image = file_path
    # ユーザー名の変更を確認
    if usersname.strip() and username != usersname:
        # ユーザー名を更新する
        conn = conn_db()
        cursor = conn.cursor()
        cursor.execute("UPDATE users SET username = %s WHERE users_id = %s", (usersname, users_id))
        conn.commit()
        cursor.close()
        conn.close()
    # DB接続
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    # プロフィールテーブルに対するクエリ
    cursor.execute("SELECT * FROM profiles WHERE users_id = %s", (users_id,))
    existing_profile = cursor.fetchone()  # 既存のプロフィールを取得
    if existing_profile:
        # 既存のプロフィールがある場合は、bioとprofile_imageを更新する
        if not bio:
            bio = existing_profile['bio']  # 空の場合はデータベースの値を使用
        if not profile_image:
            profile_image = existing_profile['profile_image']  # 空の場合はデータベースの値を使用
        cursor.execute("UPDATE profiles SET bio = %s, profile_image = %s, updated_at = %s WHERE users_id = %s",
                       (bio, profile_image, current_datetime, users_id))
    else:
        # 新しいプロフィールを挿入する
        cursor.execute("INSERT INTO profiles (bio, profile_image, profile_movie, created_at, updated_at, users_id) VALUES (%s, %s, %s, %s, %s, %s)",
                       (bio, profile_image, profile_movie, current_datetime, current_datetime,users_id))
    # 変更をコミットして接続を閉じる
    connection.commit()
    cursor.close()
    connection.close()
    return redirect('/profile')

# 購入履歴
@app.route('/purchase_history')
def purchase_history():
    return render_template('purchase_history.html')

# zoom
@app.route('/zoom')
def zoom():
    return render_template('zoom.html')

@app.route('/join_meeting', methods=['POST'])
def join_meeting():
    meeting_id = request.form.get('meeting_id')
    user_name = request.form.get('user_name')
    join_url = create_zoom_meeting_link(meeting_id, user_name,)
    return redirect(join_url)
def create_zoom_meeting_link(meeting_id, user_name):
    return f'https://zoom.us/wc/{meeting_id}/join?prefer=1&un={user_name}'


# Zoom Webhookのエンドポイント
# @app.route('/webhook', methods=['POST'])
# def webhook():
#     try:
#         # ZoomからのWebhookデータを取得
#         zoom_data = json.loads(request.data)

#         # 特定のイベント（例: ミーティング終了）を処理
#         if zoom_data['event'] == 'meeting.ended':
#             # ここで特定のページにリダイレクトする処理を実装
#             print('Meeting ended, redirecting to specific page')
#             return redirect('https://example.com/specific-page')

#     except Exception as e:
#         print(f"Error: {str(e)}")

#     return '', 200

# 通知
@app.route('/notifications')
def notifications():
    return render_template('notifications.html')

# お気に入り
@app.route('/favorites')
def favorites():
    return render_template('favorites.html')

# 管理者ログイン
@app.route('/admin_login')
def admin_login():
    return render_template('admin_login.html')

# 管理者トップ
@app.route('/admin_dashbord')
def admin_dashbord():
    return render_template('admin_dashbord.html')

# マスターメンテナンス
@app.route('/master_maintenance')
def master_maintenance():
    return render_template('master_maintenance.html')


# !商品一覧ーーーーーーーーーーーー
@app.route('/show_all')
def show_all():
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    # cursor.execute('SELECT * FROM items')
    cursor.execute('SELECT * FROM items where items_id >= 1000 ORDER BY RAND() LIMIT 40')
    products = cursor.fetchall()
    
    connection.close()
    return render_template('show_all.html', products=products)