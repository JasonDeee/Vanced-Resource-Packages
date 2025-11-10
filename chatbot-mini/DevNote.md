### Lưu ý

Tôi sẽ tạo một video hướng dãn cụ thể cách set up chat bot. Vì vậy chúng ta sẽ không cần những file Markdown hướng dẫn. Tuy nhiên package của chúng ta vẫn phải thật sự đơn giản cho việc set up

Thư mục "ChatbotMini_Package" sẽ thành một Repo riêng của tôi (Người tạo ra template) trên Github và public với URL: https://cdn.vanced.media/chatbot-mini

Giao diện Generator Tool sẽ tạo ra 3 thẻ script:

1. là window.VancedChatbotConfig

2. là script để append thư viện css theo tên theme vào thẻ head của web người dùng. Có endpoint dạng: https://cdn.vanced.media/chatbot-mini/style/[ThemeName].css

3. là CDN chính:
   sau khi DOMLoaded, CDN sẽ dùng để append các thẻ HTML của chat bot, CDN sẽ chưa logic để giao tiếp với worker luôn.
   Script của CDN chính sẽ nằm trong thư mục: cdn.vanced.media/chatbot-mini/scripts/newest/generator.js

\*\*\*Lưu ý: Không đặt Apps Script URL vào giao diện web của người dùng. Trong PackGenerator cũng sẽ không có input của Apps Script URL. Phần này do tôi nhầm lẫn, hãy sửa lại #package_Info.md theo thông tin như bên trên tôi đề cập.

Người dùng (Cộng đồng) sẽ host dự án này lên Github, public thành một page và có tên miền riêng để sử dụng màn hình Admin Chat

Về CDN, và giao diện chat, CDN vẫn sẽ trỏ về dự án của Tôi (Người tạo ra template). người dùng không cần tự host các đoạn code này.
Họ sẽ chỉ cần host danh sách tài nguyên dưới đây: Worker's Code, Trang HTML của màn hình Admin, PackGenerator.

Họ không cần host lên repo của họ:
CDN;
App Script code (Vì họ chỉ cần copy trực tiếp code từ Repo của tôi);
Templates;
