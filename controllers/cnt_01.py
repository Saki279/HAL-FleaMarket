# from flask import Blueprint, render_template
# from models.models import UserModel
# import mysql.connector,json,os,hashlib
# from flask import render_template, request, redirect, url_for,make_response,jsonify,session
# from datetime import datetime,timedelta
# from flask import render_template, request, redirect
# from zoomus import ZoomClient

# main = Blueprint('main', __name__)
# # キー、シークレット、ID入れる
# API_KEY = ''
# API_SECRET = ''
# zoom_client = ZoomClient(API_KEY, API_SECRET,api_account_id='')
# main.secret_key = "0123456789"  # セッションに使用する秘密鍵を設定
# # パスワードをハッシュ化
# def hash_password(password):
#     return hashlib.sha256(password.encode()).hexdigest()

# main.config['UPLOAD_FOLDER'] = 'static/images'
# main.config['UPLOADED_PHOTOS_DEST'] = 'static/images'  # アップロード先ディレクトリ
# main.secret_key="qawsedrftgyhujikolp" 
# main.permanent_session_lifetime= timedelta(minutes=60)

# # MySQL接続設定
# db_config = {
#     'host': 'localhost',
#     'user': 'root',
#     'password': 'P@ssw0rd',
#     'database': 'ihdb'
# }

# def conn_db():
#     conn=mysql.connector.connect(
#         host="127.0.0.1",
#         user="root",
#         password="P@ssw0rd",
#         db="ihdb",
#     )
#     return conn 


# # ページの表示
# @main.route('/')
# def display():
#         # ログインしている場合はリダイレクト
#     if 'email' in session:
#         return redirect(url_for('index'))
#     return render_template("login.html")

# # ログイン
# @main.route('/login', methods=["POST"])
# def login():
#     email = request.form.get("email")
#     password = request.form.get("password")
#     # パスワードをハッシュ化
#     hashed_password = hash_password(password)
#     # データベースへの接続
#     conn = conn_db()
#     cursor = conn.cursor()
#     # ユーザーの存在を確認（ハッシュ化されたパスワードを使用）
#     query = "SELECT * FROM users WHERE email = %s AND password = %s"
#     cursor.execute(query, (email, hashed_password))
#     user = cursor.fetchone()
#     # データベースとの接続を閉じる
#     cursor.close()
#     conn.close()
#         # ユーザーが存在する場合
#     if user:
#         # セッションにユーザーIDを保存
#         session['email'] = user[4]
#         # ログイン成功の処理（ここではリダイレクトする例）
#         return redirect(url_for("index"))
#     else:
#         # ログイン失敗の処理（ここではエラーメッセージを含んだテンプレートを表示する例）
#         return render_template("login.html", err="無効なパスワードまたはメールアドレスです")

# # 会員登録
# @main.route('/signin', methods=["POST"])
# def signin():
#     # ログインしている場合はリダイレクト
#     if 'email' in session:
#         return redirect(url_for('index'))
#     name = request.form.get("name")
#     email = request.form.get("email")
#     password = request.form.get("password")
#     aria = request.form.get("aria")
#     phonenumber = request.form.get("phonenumber")
#     arianame = ""  # 初期化
#     if aria == "1":
#         arianame = "japan"
#     elif aria == "2":
#         arianame = "Australia"
#     elif aria == "3":
#         arianame = "U.K"
#     elif aria == "4":
#         arianame = "U.A"
#     elif aria == "5":
#         arianame = "China"
#     # パスワードをハッシュ化
#     hashed_password = hash_password(password)
#     # データベースに接続
#     conn = conn_db()
#     cursor = conn.cursor()
#     # ユーザーが既に存在するか確認
#     cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
#     existing_user = cursor.fetchone()
#     if existing_user:
#         # 既に存在する場合はログインページに戻る
#         return render_template("login.html", error="このメールアドレスは既に使われています")
#     # 現在の日時を取得
#     current_datetime = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
#     # 新しいユーザーをデータベースに追加
#     cursor.execute("INSERT IGNORE INTO area (area_id, area) VALUES (%s, %s)", (aria, arianame))
#     cursor.execute("INSERT INTO users (username, email, password,aria_id , created_at, updated_at, phonenumber) VALUES (%s,%s,%s,%s,%s,%s,%s)",(name, email, hashed_password, aria, current_datetime, current_datetime, phonenumber))
#     conn.commit()
#     # ユーザーIDをセッションに保存
#     session['email'] = email
#     # データベースとの接続を閉じる
#     cursor.close()
#     conn.close()
#     # 成功時にlogin.htmlにリダイレクト
#     return redirect(url_for("hoge"))

# # ログアウト
# @main.route('/logout')
# def logout():
#     # セッションをクリア
#     session.clear()
#     # ログアウト後の処理（ここではトップページにリダイレクトする例）
#     return redirect(url_for('hoge'))

# # トップ
# @main.route('/index')
# def index():
#     return render_template('index.html')

# # 検索結果
# @main.route('/search_results')
# def search_results():
#     return render_template('search_results.html')

# # 商品詳細
# @main.route('/product_detail')
# def product_detail():
#     return render_template('product_detail.html')

# # チャット
# @main.route('/chat')
# def chat():
#     return render_template('chat.html')

# # 支払方法選択
# @main.route('/payment_selection')
# def payment_selection():
#     return render_template('payment_selection.html')

# # 配送先入力
# @main.route('/delivery_address_input')
# def delivery_address_input():
#     return render_template('delivery_address_input.html')

# # 決済情報確認
# @main.route('/payment_confirmation')
# def payment_confirmation():
#     return render_template('payment_confirmation.html')

# # 購入完了
# @main.route('/purchase_complete')
# def purchase_complete():
#     return render_template('purchase_complete.html')


# @main.route('/add_product', methods=['GET', 'POST'])
# def add_product():
#     if request.method == 'POST':
#         name = request.form['name']
#         description = request.form['description']
#         price = float(request.form['price'])
#         meeting_date_date = request.form['meeting_date_date']
#         meeting_date_time = request.form['meeting_date_time']
#         combined_text = f'Meeting Date: {meeting_date_date}, Meeting Time: {meeting_date_time}'
#         # 画像アップロード処理
#         file=request.files["image"]
#         file.save(os.path.join("./static/images",file.filename))
#         image_url=os.path.join("./static/images",file.filename)
#         user_id = 1
#         # 日時
#         date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
#         # カテゴリー
#         ctg=1
#         connection = mysql.connector.connect(**db_config)
#         cursor = connection.cursor()
#         cursor.execute('INSERT INTO items (name, discription, price, image_url, users_id,meeting_time,created_at,updated_at,categories_id) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)',
#             (name, description, price, image_url, user_id,combined_text,date,date,ctg))
#         connection.commit()
#         connection.close()

#         return redirect(url_for('product_upload_complete'))

#     return render_template('product_input.html')

# # 出品完了
# @main.route('/product_upload_complete')
# def product_upload_complete():
#     return render_template('product_upload_complete.html')

# # カート
# @main.route('/cart')
# def cart():
#     return render_template('cart.html')

# # プロフィール
# @main.route('/profile')
# def profile():
#     return render_template('profile.html')

# # プロフィール編集
# @main.route('/profile_edit')
# def profile_edit():
#     return render_template('profile_edit.html')

# # 購入履歴
# @main.route('/purchase_history')
# def purchase_history():
#     return render_template('purchase_history.html')

# # zoom
# @main.route('/zoom')
# def zoom():
#     return render_template('zoom.html')

# @main.route('/join_meeting', methods=['POST'])
# def join_meeting():
#     meeting_id = request.form.get('meeting_id')
#     user_name = request.form.get('user_name')
#     join_url = create_zoom_meeting_link(meeting_id, user_name,)
#     return redirect(join_url)
# def create_zoom_meeting_link(meeting_id, user_name):
#     return f'https://zoom.us/wc/{meeting_id}/join?prefer=1&un={user_name}'

# # 通知
# @main.route('/notifications')
# def notifications():
#     return render_template('notifications.html')

# # お気に入り
# @main.route('/favorites')
# def favorites():
#     return render_template('favorites.html')

# # 管理者ログイン
# @main.route('/admin_login')
# def admin_login():
#     return render_template('admin_login.html')

# # 管理者トップ
# @main.route('/admin_dashboar')
# def admin_dashboar():
#     return render_template('admin_dashboar.html')

# # マスターメンテナンス
# @main.route('/master_maintenance')
# def master_maintenance():
#     return render_template('master_maintenance.html')
