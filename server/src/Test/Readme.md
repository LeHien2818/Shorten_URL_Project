#### 1: Hướng dẫn sử dụng Apache benmark trên ubuntu
#### Step 1: cài đặt apache benmark
    sudo apt update
    sudo apt-get install apache2-utils
#### Step 2: Sử dụng apache benmark 
    ab -n [số yêu cầu] -c [số kết nối đồng thời] [địa chỉ URL]
    
    VD: ab -n 1000 -c 100 http://example.com/
    ## Cài đặt Apache Benchmark trên Windows
#### 2: Hướng dẫn sử dụng Apache benmark trên ubuntu

### Tùy chọn 1: Cài đặt Apache HTTP Server

1. Tải xuống bản cài đặt Apache HTTP Server từ [Apache Haus](https://www.apachehaus.com/cgi-bin/download.plx) hoặc [Apache Lounge](https://www.apachelounge.com/download/).
2. Thực hiện cài đặt Apache HTTP Server.
3. Apache Benchmark (`ab`) sẽ có sẵn trong thư mục `bin` của thư mục cài đặt Apache.

### Tùy chọn 2: Tải xuống Apache Benchmark độc lập

1. Tìm kiếm và tải xuống bản build của Apache Benchmark dành cho Windows từ một nguồn đáng tin cậy.
2. Giải nén file (nếu cần) và đặt `ab.exe` vào thư mục mong muốn.
3. (Tuỳ chọn) Thêm thư mục chứa `ab.exe` vào biến môi trường `PATH`.

### Tùy chọn 3: Sử dụng WSL (Windows Subsystem for Linux)

1. Mở terminal WSL trên Windows.
2. Cài đặt apache2-utils bằng lệnh: `sudo apt-get install apache2-utils`.
3. Chạy `ab` từ terminal WSL.

### Tùy chọn 4: Sử dụng XAMPP

1. Tải xuống và cài đặt XAMPP từ [trang web chính thức](https://www.apachefriends.org/index.html).
2. Tìm `ab.exe` trong thư mục `xampp/apache/bin`.

Sau khi cài đặt, bạn có thể chạy Apache Benchmark từ Command Prompt hoặc PowerShell bằng cách sử dụng lệnh `ab` với các tham số cần thiết.
  
#### 3: Hướng dẫn cài đặt JMeter
#### Cài đặt trên Linux
#### Step 1: Cài đặt Java version 8 hoặc mới hơn:
    sudo apt-get update
    sudo apt-get install openjdk-8-jdk
#### Step 2: Tải về JMeter 5.5:

    wget https://archive.apache.org/dist/jmeter/binaries/apache-jmeter-5.5.tgz
#### Step 3: Giải nén tệp tin JMeter:

tar xf apache-jmeter-5.5.tgz
#### Step 4: Khởi chạy JMeter:
    Cách 1:  Sử dụng Ứng dụng JMeter
        cd apache-jmeter-5.5/bin/
        ./jmeter.sh
        Chạy dự án của bạn và mở tệp jmx bằng jmeter
    Cách 2:Sử dụng terminal vscode nonGUI
        mở Command Palette (Ctrl+Shift+P) 
        chọn "Tasks: Run Task", sau đó chọn "test:jmeter".        
#### Cài đặt trên Windows
#### Step 1: Cài đặt Java
Tải xuống và cài đặt Java từ trang web chính thức: https://www.oracle.com/java/technologies/javase-downloads.html
Cài đặt Java theo hướng dẫn từ trang web.
#### Step 2: Tải về JMeter 5.5 từ trang chủ Apache JMeter:
    https://jmeter.apache.org/download_jmeter.cgi
    Giải nén tệp tin JMeter
    Đảm bảo rằng bạn đã cài đặt Java version 8 hoặc mới hơn.
#### Step 3: Khởi chạy JMeter:
    Mở thư mục bin trong thư mục JMeter.
    Chạy tệp jmeter.bat.



