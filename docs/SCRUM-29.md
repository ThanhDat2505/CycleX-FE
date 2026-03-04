|<h3>**[SCRUM-29] [**Chuẩn hóa màn hình (SDT)**](https://phanthanhdat2505.atlassian.net/browse/SCRUM-29)** Created: 10/Jan/26  Updated: 27/Jan/26 </h3>||
| :- | :- |
|**Status:**|To Do|
|**Project:**|[SWP391](https://phanthanhdat2505.atlassian.net/secure/BrowseProject.jspa?id=10000)|
|**Components:**|None |
|**Affects versions:**|None |
|**Fix versions:**|None |

|**Type:**|Task |**Priority:**|Medium |
| :- | :- | :- | :- |
|**Reporter:**|<a name="word_reporter_712020:cc273015-bf51-4dc9-9b49-18d3581e6ffc"></a>[Lý Vũ Quốc Huy ](https://phanthanhdat2505.atlassian.net/secure/ViewProfile.jspa?accountId=712020%3Acc273015-bf51-4dc9-9b49-18d3581e6ffc)|**Assignee:**|Unassigned |
|**Resolution:**|Unresolved |**Votes:**|0 |
|**Labels:**|None |||
|**Remaining Estimate:**|Not Specified |||
|**Time Spent:**|Not Specified |||
|**Original estimate:**|Not Specified |||

|**Rank:**|0|i00033: |
| :- | :- |
|**Sprint:**||

|` `**Description**  | |
| :-: | :- |

|<p>Tôi là nháp trước thôi, chứ cả nhóm chưa chốt</p><p><h1><a name="danhs%c3%81chscreen%e2%80%93to%c3%80nh%e1%bb%86th%e1%bb%90ng"></a>**DANH SÁCH SCREEN – TOÀN HỆ THỐNG**</h1></p><p>Editable ❌ là không được chỉnh sửa, V là có thể thay đổi</p><p>-----</p><p><h2><a name="%f0%9f%8c%901.screend%c3%99ngchung%2fentry"></a>**🌐 1. SCREEN DÙNG CHUNG / ENTRY**</h2></p>|
| :- |

|**Screen ID**|**Screen Name**|**Actor**|**BP**|
| :-: | :-: | :-: | :-: |
|S-01|Home / Landing Page|Guest, Buyer|BP3|
|S-02|Login Screen|All|(Global)|
|S-03|Register Screen|Guest|(Global)|
|S-04|User Profile|Buyer, Seller|Supporting|
|S-05|Notification Center|All|Supporting (BP1–BP7)|

|<p>-----</p><p><h2><a name="%f0%9f%9f%a62.seller%e2%80%93bp1%28%c4%90%c4%83ngtin%26qu%e1%ba%a3nl%c3%bdtin%29"></a>**🟦 2. SELLER – BP1 (Đăng tin & quản lý tin)**</h2></p>|
| :- |

|**Screen ID**|**Screen Name**|**Actor**|**BP**|
| :-: | :-: | :-: | :-: |
|S-10|Seller Dashboard|Seller|BP1|
|S-11|My Listings|Seller|BP1|
|S-12|Create Listing (Form)|Seller|BP1|
|S-13|Upload Images|Seller|BP1|
|S-14|List Listing Preview|Seller|BP1|
|S-15|Listing Detail (Seller View)|Seller|BP1|
|S-16|Edit Listing|Seller|BP1|
|S-18|Draft Listings|Seller|BP1|

|<p>-----</p><p><h2><a name="%f0%9f%9f%a83.inspector%e2%80%93bp2%28ki%e1%bb%83mduy%e1%bb%87ttin%29"></a>**🟨 3. INSPECTOR – BP2 (Kiểm duyệt tin)**</h2></p>|
| :- |

|**Screen ID**|**Screen Name**|**Actor**|**BP**|
| :-: | :-: | :-: | :-: |
|S-20|Inspector Dashboard|Inspector|BP2|
|S-21|Pending Listings|Inspector|BP2|
|S-22|Listing Review Detail|Inspector|BP2|
|S-24|Review History|Inspector|BP2|

|<p>-----</p><p><h2><a name="%f0%9f%9f%a94.buyer%2fguest%e2%80%93bp3%28xem%26t%c3%acmki%e1%ba%bfm%29"></a>**🟩 4. BUYER / GUEST – BP3 (Xem & tìm kiếm)**</h2></p>|
| :- |

|**Screen ID**|**Screen Name**|**Actor**|**BP**|
| :-: | :-: | :-: | :-: |
|S-31|Listing List (Seach và flter, chung 1 trang nhưng ở vị trí sidebar)|Guest, Buyer|BP3|
|S-32|Listing Detail (Public)|Guest, Buyer|BP3|
|S-33|Seller Profile (Public)|Guest, Buyer|BP3|

|<p>-----</p><p><h2><a name="%f0%9f%9f%a85.bp4%e2%80%93trao%c4%90%e1%bb%94iki%e1%bb%82m%c4%90%e1%bb%8anh%28supporting%e2%80%93b%e1%ba%aetbu%e1%bb%98c%29"></a>**🟨 5. BP4 – TRAO ĐỔI KIỂM ĐỊNH (SUPPORTING – BẮT BUỘC)**</h2></p>|
| :- |

|**Screen ID**|**Screen Name**|**Actor**|**BP**|
| :-: | :-: | :-: | :-: |
|S-40|Inspection Chat Thread|Inspector, Seller|BP4|
|S-41|Inspection Request Detail|Inspector|BP4|
|S-42|Inspection Response Screen|Seller|BP4|
|S-43|Inspection Summary|Inspector|BP4|

|<p>🔖 **Note:** BP4 là *supporting* nhưng **có screen riêng**, không ẩn.</p><p>-----</p><p><h2><a name="%f0%9f%9f%a96.buyer%26seller%e2%80%93bp5%28%c4%90%e1%ba%b7tmua%2f%c4%91%e1%ba%b7tc%e1%bb%8dc%29"></a>**🟩 6. BUYER & SELLER – BP5 (Đặt mua / đặt cọc)**</h2></p>|
| :- |

|**Screen ID**|**Screen Name**|**Actor**|**BP**|
| :-: | :-: | :-: | :-: |
|S-50|Purchase / Deposit Request|Buyer|BP5|
|S-51|Transaction Summary|Buyer|BP5|
|S-52|Pending Transactions|Seller|BP5|
|S-53|Transaction Detail (Seller View)|Seller|BP5|
|S-54|Transaction Detail (Buyer View)|Buyer|BP5|

|<p>-----</p><p><h2><a name="%f0%9f%9f%aa7.shipper%e2%80%93bp6%28giao%26ho%c3%a0nt%e1%ba%a5t%29"></a>**🟪 7. SHIPPER – BP6 (Giao & hoàn tất)**</h2></p>|
| :- |

|**Screen ID**|**Screen Name**|**Actor**|**BP**|
| :-: | :-: | :-: | :-: |
|S-60|Shipper Dashboard|Shipper|BP6|
|S-61|Assigned Deliveries|Shipper|BP6|
|S-62|Delivery Detail|Shipper|BP6|
|S-63|Delivery Confirmation|Shipper|BP6|
|S-64|Delivery Failed Report|Shipper|BP6 → BP7|

|<p>-----</p><p><h2><a name="%f0%9f%9f%a58.bp7%e2%80%93h%e1%bb%a6y%2fkhi%e1%ba%beun%e1%ba%a0i%2ftranhch%e1%ba%a4p%28exceptionflow%29"></a>**🟥 8. BP7 – HỦY / KHIẾU NẠI / TRANH CHẤP (EXCEPTION FLOW)**</h2></p>|
| :- |

|**Screen ID**|**Screen Name**|**Actor**|**BP**|
| :-: | :-: | :-: | :-: |
|S-70|Dispute Creation|Buyer, Seller|BP7|
|S-71|Dispute List|Inspector, Admin|BP7|
|S-72|Dispute Detail|Inspector|BP7|
|S-73|Dispute Resolution|Inspector|BP7|
|S-74|Dispute Result View|Buyer, Seller|BP7|

|<p>-----</p><p><h2><a name="%f0%9f%9f%a59.admin%28canthi%e1%bb%86p%e2%80%93kh%c3%94ngmainactor%29"></a>**🟥 9. ADMIN (CAN THIỆP – KHÔNG MAIN ACTOR)**</h2></p>|
| :- |

|**Screen ID**|**Screen Name**|**Actor**|**BP**|
| :-: | :-: | :-: | :-: |
|S-80|Admin Dashboard|Admin|Supporting|
|S-81|User Management|Admin|Supporting|
|S-82|Audit Log|Admin|Supporting|
|S-83|Dispute Override|Admin|BP7 (Special)|

|<h2><a name="t%e1%bb%95ngs%e1%bb%91screenth%e1%bb%b0ct%e1%ba%bel%c3%a0baonhi%c3%aau%3f"></a>**Tổng số screen THỰC TẾ là bao nhiêu?**</h2>|
| :- |

|**Nhóm**|**Số screen**|
| :-: | :-: |
|Global|5|
|Seller (BP1)|10|
|Inspector (BP2)|5|
|Buyer / Guest (BP3)|4|
|BP4 (supporting)|4|
|BP5|5|
|BP6|5|
|BP7|5|
|Admin|4|
|**TỔNG**|**47 screen**|

|<p><h1><a name="templatesdtchu%e1%ba%a8nchoscreenchung%28b%e1%ba%a0nn%c3%8and%c3%99ng%29"></a>**TEMPLATE SDT CHUẨN CHO SCREEN CHUNG (BẠN NÊN DÙNG)**</h1></p><p>Bạn có thể dùng **y nguyên template này** cho toàn bộ screen chung:</p><p>-----</p><p><h3><a name="%f0%9f%94%b9screendefinitiontable%e2%80%93globalscreen"></a>**🔹 Screen Definition Table – GLOBAL SCREEN**</h3></p><p>**Screen ID:**<br>**Screen Name:**</p><p>**Actor:**</p><p>**Type:**<br>Utility / Entry / Supporting</p><p>**Purpose:**</p><p>Mô tả DUY NHẤT mục đích của screen, không hơn.</p><p>**Editable:**<br>❌ (hoặc ghi rõ phạm vi rất hẹp)</p><p>**Allowed Actions (CTA):**</p><p>- …</p><p>**Forbidden Actions:**</p><p>- ❌ Không tạo / sửa / xoá entity nghiệp vụ</p><p>- ❌ Không thay đổi trạng thái BP</p><p>- ❌ Không điều hướng trực tiếp vào step nghiệp vụ</p><p>**Access Rule:**</p><p>- Truy cập từ …</p><p>**Design Note:**</p><p>Screen này **không thuộc bất kỳ BP nào** và **không được dùng để xử lý nghiệp vụ**.</p><p>-----</p><p><h1><a name="6.v%c3%8dd%e1%bb%a4c%e1%bb%a4th%e1%bb%82%28%c3%81pd%e1%bb%a4ngchod%e1%bb%b0%c3%81nb%e1%ba%a0n%29"></a>**6. VÍ DỤ CỤ THỂ (ÁP DỤNG CHO DỰ ÁN BẠN)**</h1></p><p><h3><a name="%f0%9f%8c%90s02%e2%80%93loginscreen"></a>**🌐 S-02 – Login Screen**</h3></p><p>- **Actor:** All</p><p>- **Type:** Entry / Utility</p><p>- **Purpose:** Xác thực người dùng để truy cập hệ thống</p><p>- **Editable:** ✅ (email, password)</p><p>- **Allowed Actions:** Login</p><p>- **Forbidden Actions:** </p><p>&emsp;- ❌ Không tạo listing</p><p>&emsp;- ❌ Không tạo transaction</p><p>&emsp;- ❌ Không xác định BP</p><p>- **Access Rule:** từ S-01</p><p>- **Design Note:** Redirect sau login **theo role**, không theo BP</p><p>👉 Dev nhìn là **biết dừng đúng chỗ**.</p><p>-----</p><p><h3><a name="%f0%9f%94%94s05%e2%80%93notificationcenter"></a>**🔔 S-05 – Notification Center**</h3></p><p>- **Actor:** All authenticated users</p><p>- **Type:** Utility</p><p>- **Purpose:** Hiển thị thông báo hệ thống</p><p>- **Editable:** ❌</p><p>- **Allowed Actions:** View notification</p><p>- **Forbidden Actions:** </p><p>&emsp;- ❌ Không approve</p><p>&emsp;- ❌ Không confirm</p><p>&emsp;- ❌ Không cancel</p><p>- **Access Rule:** từ header</p><p>- **Design Note:** Read-only, không chứa CTA nghiệp vụ</p><p>-----</p><p><h1><a name="7.screenchungs%e1%ba%bcxu%e1%ba%a4thi%e1%bb%86n%e1%bb%9e%c4%90%c3%82utrongscreenflow%3f"></a>**7. SCREEN CHUNG SẼ XUẤT HIỆN Ở ĐÂU TRONG SCREEN FLOW?**</h1></p><p>- Có **1 block riêng: “Global Screens (Utility)”**</p><p>- Screen Flow BP **chỉ reference**, không đi xuyên qua</p><p>Ví dụ ghi chú:</p><p>“S-05 accessible from all authenticated screens (side access)”<br>📘 SCREEN DEFINITION TABLE (SDT)</p><p><h2><a name="%f0%9f%9f%a6bp1%e2%80%93seller%3ascreendefinitiontable"></a>**🟦 BP1 – SELLER: SCREEN DEFINITION TABLE**</h2></p><p>-----</p><p><h3><a name="%f0%9f%94%b9s10%e2%80%93sellerdashboard"></a>**🔹 S-10 – Seller Dashboard**</h3></p>|
| :- |

|**Field**|**Định nghĩa**|
| :-: | :-: |
|Purpose|Tổng quan hoạt động Seller|
|Actor|Seller|
|Type|View|
|Editable|❌|
|Shows|số tin theo trạng thái (Draft, Pending, Active, Held)|
|Primary CTA|“Tạo tin mới”, “Quản lý tin”|
|Entry from|Login|
|Exit to|S-11, S-12|

|<p>✅ **Không mơ hồ**: dashboard chỉ để điều hướng & overview.</p><p>-----</p><p><h3><a name="%f0%9f%94%b9s11%e2%80%93mylistings"></a>**🔹 S-11 – My Listings**</h3></p>|
| :- |

|**Field**|**Định nghĩa**|
| :-: | :-: |
|Purpose|Quản lý danh sách tin|
|Actor|Seller|
|Type|View + Action|
|Editable|❌|
|Shows|danh sách tin + trạng thái|
|Primary CTA|View Detail, Edit (tuỳ trạng thái)|
|Entry from|S-10|
|Exit to|S-15, S-16|

|<p>✅ **Rõ**: đây là *management list*, không phải detail.</p><p>-----</p><p><h3><a name="%f0%9f%94%b9s12%e2%80%93createlisting%28form%29"></a>**🔹 S-12 – Create Listing (Form)**</h3></p>|
| :- |

|**Field**|**Định nghĩa**|
| :-: | :-: |
|Purpose|Tạo tin mới|
|Actor|Seller|
|Type|Create|
|Editable|✅|
|Required data|thông tin xe|
|Primary CTA|“Tiếp tục upload ảnh”, “Lưu nháp”|
|Entry from|S-10, S-11|
|Exit to|S-13|

|<p>🔒 **Khoá rõ**: chưa submit → chưa tạo listing ACTIVE.</p><p>-----</p><p><h3><a name="%f0%9f%94%b9s13%e2%80%93uploadimages"></a>**🔹 S-13 – Upload Images**</h3></p>|
| :- |

|**Field**|**Định nghĩa**|
| :-: | :-: |
|Purpose|Upload hình ảnh cho tin|
|Actor|Seller|
|Type|Create (step)|
|Editable|✅|
|Rule|≥ 3 ảnh|
|Primary CTA|“Xem trước”, “Lưu nháp”|
|Entry from|S-12|
|Exit to|S-14|

|<p>👉 **Rõ là step**, không phải screen độc lập nghiệp vụ.</p><p>-----</p><p><h3><a name="%f0%9f%94%b9s14%e2%80%93listlistingpreview%28seller%29"></a>**🔹 S-14 – List Listing Preview (Seller)**</h3></p><p><h3><a name="screendefinitiontable%e2%80%93final"></a>**Screen Definition Table – FINAL**</h3></p>|
| :- |

|**Field**|**Value**|
| :-: | :-: |
|Screen ID|S-14|
|Screen Name|Listing Preview|
|Actor|Seller|
|BP|BP1|
|Purpose|Xem lại toàn bộ nội dung tin đăng trước khi gửi duyệt, Listing Status View|
|Type|Review|
|Editable|❌|
|**Editable Scope**|❌ Không chỉnh sửa trực tiếp bất kỳ field dữ liệu nào|
|**Allowed Actions (CTA)**|Submit Listing, Back to Edit|
|**Forbidden Actions**|❌ Edit field trực tiếp ❌ Upload ảnh ❌ Thay đổi trạng thái tin|
|**Design Constraints**|Đây là **điểm submit DUY NHẤT** của quy trình tạo tin. Không được phép tạo tin ở screen khác.|
|Entry from|S-13 – Upload Images|
|Exit to|S-15 – Listing Detail (Seller View)|
|Status|**DESIGN-LOCKED**|

|<p>🔒 **Chốt rõ cho dev**:</p><p>- Không có input</p><p>- Không submit ở Create / Upload</p><p>- Không “tiện tay” cho edit inline</p><p>-----</p><p><h3><a name="s15%e2%80%93listingdetail%28sellerview%29"></a>**S-15 – Listing Detail (Seller View)**</h3></p><p><h3>**Screen Definition Table – FINAL**</h3></p>|
| :- |

|**Field**|**Value**|
| :-: | :-: |
|Screen ID|S-15|
|Screen Name|Listing Detail (Seller View)|
|Actor|Seller|
|BP|BP1|
|Purpose|Xem chi tiết tin đăng và thực hiện hành động phù hợp theo trạng thái|
|Type|View (State-based)|
|Editable|❌|
|**Editable Scope**|❌ Không chỉnh sửa trực tiếp field dữ liệu trên screen|
|**Allowed Actions (CTA)**|Edit Listing, Respond Request Info, View Status|
|**Forbidden Actions**|❌ Edit khi SOLD ❌ Submit khi không ở DRAFT / NEED\_MORE\_INFO|
|**Design Constraints**|CTA hiển thị **PHỤ THUỘC trạng thái** của listing. Logic trạng thái xử lý ở backend, UI chỉ phản ánh.|
|Entry from|S-11 – My Listings, S-14 – Listing Preview|
|Exit to|S-16 – Edit Listing, S-19 – Need More Info|
|Status|**DESIGN-LOCKED**|

|<p>🔒 **Chốt cho design & code**:</p><p>- Đây là **1 screen duy nhất**, không tách theo trạng thái</p><p>- Không có form</p><p>- Không cho edit inline</p><p>- CTA là **conditional UI**</p><p>-----</p><p><h3><a name="%f0%9f%94%b9s16%e2%80%93editlisting"></a>**🔹 S-16 – Edit Listing**</h3></p>|
| :- |

|**Field**|**Định nghĩa**|
| :-: | :-: |
|Purpose|Chỉnh sửa tin|
|Actor|Seller|
|Type|Update|
|Editable|✅|
|Rule|Không edit khi SOLD|
|Entry from|S-15|
|Exit to|S-15|

|<p>-----</p><p><h3><a name="%f0%9f%94%b9s17%e2%80%93listingstatusview%e2%9d%8c%28lo%e1%ba%a0ib%e1%bb%8e%29"></a>**🔹 S-17 – Listing Status View ❌ (LOẠI BỎ)**</h3></p><p>👉 **Quyết định kỹ thuật: LOẠI**</p><p>**Lý do:**</p><p>- Trạng thái đã được thể hiện trong Listing Detail (Seller View)</p><p>- Tách screen riêng → mơ hồ, dư thừa</p><p>✅ **Giải quyết mơ hồ triệt để**</p><p>-----</p><p><h3><a name="%f0%9f%94%b9s18%e2%80%93draftlistings"></a>**🔹 S-18 – Draft Listings**</h3></p>|
| :- |

|**Field**|**Định nghĩa**|
| :-: | :-: |
|Purpose|Quản lý tin nháp|
|Actor|Seller|
|Type|View|
|Editable|❌|
|Primary CTA|Continue Draft|
|Entry from|S-11|
|Exit to|S-12|

|<p>-----</p><p><h3><a name="%f0%9f%94%b9s19%e2%80%93listingneedmoreinfo"></a>**🔹 S-19 – Listing Need More Info**</h3></p>|
| :- |

|**Field**|**Định nghĩa**|
| :-: | :-: |
|Purpose|Bổ sung thông tin theo yêu cầu Inspector|
|Actor|Seller|
|Type|Update (guided)|
|Editable|✅|
|Trigger|Status = NEED\_MORE\_INFO|
|Entry from|S-15|
|Exit to|S-15|

|<p><h1><a name="bp2%e2%80%93inspector"></a>**BP2 – INSPECTOR**</h1></p><p><h2><a name="screendefinitiontable%28sdt%29"></a>**SCREEN DEFINITION TABLE (SDT)**</h2></p><p>**Mục tiêu BP2:**<br>Inspector kiểm duyệt tin đăng **một cách có kiểm soát**, có:</p><p>- duyệt</p><p>- từ chối</p><p>- yêu cầu bổ sung (liên kết BP4)</p><p>-----</p><p><h2><a name="%f0%9f%94%b9s20%e2%80%93inspectordashboard"></a>**🔹 S-20 – Inspector Dashboard**</h2></p>|
| :- |

|**Field**|**Định nghĩa**|
| :-: | :-: |
|Purpose|Tổng quan công việc Inspector|
|Actor|Inspector|
|Type|View|
|Editable|❌|
|Shows|số tin chờ duyệt, cần bổ sung, tranh chấp|
|Primary CTA|“Xem tin chờ duyệt”|
|Entry from|Login|
|Exit to|S-21|

|<p>✅ Dashboard **chỉ điều hướng**, không xử lý nghiệp vụ.</p><p>-----</p><p><h2><a name="%f0%9f%94%b9s21%e2%80%93pendinglistings"></a>**🔹 S-21 – Pending Listings**</h2></p>|
| :- |

|**Field**|**Định nghĩa**|
| :-: | :-: |
|Purpose|Danh sách tin chờ kiểm duyệt|
|Actor|Inspector|
|Type|View + Action|
|Editable|❌|
|Shows|list tin (summary + status)|
|Primary CTA|View Detail|
|Entry from|S-20|
|Exit to|S-22|

|<p>👉 Đây là **queue làm việc**, không phải detail.</p><p>-----</p><p><h2><a name="%f0%9f%94%b9s22%e2%80%93listingreviewdetail%28inspector%29"></a>**🔹S-22 – Listing Review Detail (Inspector)**</h2></p><p><h3>**Screen Definition Table – FINAL**</h3></p>|
| :- |

|**Field**|**Value**|
| :-: | :-: |
|**Screen ID**|**S-22**|
|**Screen Name**|**Listing Review Detail**|
|**Actor**|**Inspector**|
|**BP**|**BP2**|
|**Purpose**|**Đánh giá toàn bộ thông tin tin đăng để ra quyết định kiểm duyệt**|
|**Type**|**View (Decision Context)**|
|**Editable**|**❌**|
|**Editable Scope**|**❌ Inspector KHÔNG được chỉnh sửa bất kỳ field nào của tin đăng**|
|**Allowed Actions (CTA)**|**Approve, Reject, Request Info**|
|**Forbidden Actions**|**❌ Edit field ❌ Upload ảnh ❌ Chat trực tiếp**|
|**Design Constraints**|**Screen này** **chỉ phục vụ đánh giá & quyết định. Mọi chỉnh sửa nội dung phải do Seller thực hiện qua BP1/BP4.**|
|**Entry from**|**S-21 – Pending Listings**|
|**Exit to**|**S-23 – Approve/Reject, S-41 – BP4, S-21**|
|**Status**|**DESIGN-LOCKED**|

|<p>**🔒** **Chốt rất cứng:**</p><p>- **Không chat ở đây**</p><p>- **Không edit**</p><p>- **Request Info = sang BP4, không “tiện tay” làm ở BP2**</p><p>-----</p><p><h2><a name="s23%e2%80%93approve%2frejectlisting%28inspector%29"></a>**S-23 – Approve / Reject Listing (Inspector)**</h2></p><p><h3>**Screen Definition Table – FINAL**</h3></p>|
| :- |

|**Field**|**Value**|
| :-: | :-: |
|Screen ID|S-23|
|Screen Name|Approve / Reject Listing|
|Actor|Inspector|
|BP|BP2|
|Purpose|Ra quyết định cuối cùng đối với tin đăng|
|Type|Action / Decision|
|Editable|✅|
|**Editable Scope**|Chỉ nhập **decision + reject reason (nếu có)**|
|**Allowed Actions (CTA)**|Confirm Approve, Confirm Reject|
|**Forbidden Actions**|❌ Thay đổi nội dung tin ❌ Bỏ qua validate|
|**Design Constraints**|Reject **BẮT BUỘC có lý do**. Sau khi submit, trạng thái tin thay đổi và Inspector quay về queue.|
|Entry from|S-22 – Listing Review Detail|
|Exit to|S-21 – Pending Listings|
|Status|**DESIGN-LOCKED**|

|<p>🔒 **Chốt cho dev**:</p><p>- Đây là screen duy nhất đổi trạng thái duyệt</p><p>- Không cho approve/reject trực tiếp ở S-22</p><p>- Validate là bắt buộc</p><p>-----</p><p><h2><a name="%f0%9f%94%b9s24%e2%80%93reviewhistory%e2%9a%a0%ef%b8%8f%28xeml%e1%ba%a0i%29"></a>**🔹 S-24 – Review History ⚠️ (XEM LẠI)**</h2></p>|
| :- |

|**Field**|**Định nghĩa**|
| :-: | :-: |
|Purpose|Xem lịch sử duyệt tin|
|Actor|Inspector|
|Type|View|
|Editable|❌|
|Entry from|S-20|
|Exit to|—|

|<p><h3><a name="%f0%9f%94%8d%c4%90%c3%a1nhgi%c3%a1ki%e1%ba%bfntr%c3%bac%3a"></a>**🔍 Đánh giá kiến trúc:**</h3></p><p>- Screen này **KHÔNG bắt buộc cho MVP**</p><p>- Có thể: </p><p>&emsp;- gộp vào Dashboard (tab)</p><p>&emsp;- hoặc làm sau</p><p>👉 **Đề xuất:**<br>🔖 **GIỮ nhưng đánh dấu** Optional / Post-MVP</p><p>-----</p><p><h2><a name="%e2%9d%8cscreenkh%c3%94ngt%e1%bb%92nt%e1%ba%a0i%28quy%e1%ba%bet%c4%90%e1%bb%8anhlo%e1%ba%a0i%29"></a>**❌ SCREEN KHÔNG TỒN TẠI (QUYẾT ĐỊNH LOẠI)**</h2></p><p><h3><a name="%e2%9d%8c%e2%80%9ceditlisting%28inspector%29%e2%80%9d"></a>**❌ “Edit Listing (Inspector)”**</h3></p><p>- Inspector **không được sửa tin**</p><p>- Mọi chỉnh sửa phải quay về Seller (BP1 / BP4)</p><p>⛔ **Dev không được tạo screen này.**</p><p><h1><a name="bp3%e2%80%93buyer%2fguest"></a>**BP3 – BUYER / GUEST**</h1></p><p><h2>**SCREEN DEFINITION TABLE (SDT)**</h2></p><p>**Mục tiêu BP3 (đã khóa):**<br>Buyer / Guest tìm kiếm, xem danh sách và xem chi tiết **chỉ các tin ở trạng thái “Đang bán (ACTIVE)”**.<br>Không phát sinh giao dịch tại BP3 (chỉ điều hướng sang BP5).</p><p>-----</p><p><h2><a name="%f0%9f%94%b9s30%e2%80%93listingsearch%26filter"></a>**🔹 S-30 – Listing Search & Filter**</h2></p><p><h3><a name="screendefinitiontable"></a>**Screen Definition Table**</h3></p>|
| :- |

|**Field**|**Value**|
| :-: | :-: |
|**Screen ID**|S-30|
|**Screen Name**|Listing Search & Filter|
|**Actor**|Guest, Buyer|
|**BP**|BP3|
|**Purpose**|Cho phép người dùng nhập tiêu chí tìm kiếm & lọc tin đăng|
|**Type**|Input / Filter|
|**Editable**|✅|
|**Shows**|Ô tìm kiếm, bộ lọc (giá, loại xe, trạng thái kiểm định)|
|**Primary CTA**|Apply Filter|
|**Entry from**|S-01 – Home / Landing Page|
|**Exit to**|S-31 – Listing List|

|<p>✅ **Rõ cho dev & design**</p><p>- Đây **không phải** screen hiển thị kết quả</p><p>- Chỉ thu thập điều kiện lọc, **không hiển thị listing**</p><p>-----</p><p><h2><a name="%f0%9f%94%b9s31%e2%80%93listinglist"></a>**🔹 S-31 – Listing List**</h2></p><p><h3>**Screen Definition Table**</h3></p>|
| :- |

|**Field**|**Value**|
| :-: | :-: |
|**Screen ID**|S-31|
|**Screen Name**|Listing List|
|**Actor**|Guest, Buyer|
|**BP**|BP3|
|**Purpose**|Hiển thị danh sách tin đăng phù hợp điều kiện tìm kiếm|
|**Type**|View|
|**Editable**|❌|
|**Shows**|Danh sách listing (summary: ảnh đại diện, giá, trạng thái kiểm định)|
|**Primary CTA**|View Detail|
|**Entry from**|S-30 – Listing Search & Filter|
|**Exit to**|S-32 – Listing Detail (Public)|

|<p>📌 **Business rule áp dụng (ẩn trong backend, UI không suy diễn):**</p><p>- Chỉ listing **ACTIVE** mới được trả về (theo BP3 – ![](Aspose.Words.d49945c6-e7be-49af-a9d7-924c2536d99c.001.png)[ SCRUM-25 ](https://phanthanhdat2505.atlassian.net/browse/SCRUM-25 "Business process")To Do )</p><p>-----</p><p><h2><a name="%f0%9f%94%b9s32%e2%80%93listingdetail%28public%29"></a>**🔹 S-32 – Listing Detail (Public)**</h2></p><p>⚠️ **Đây là screen state-based / decision-context**<br>→ **BẮT BUỘC có 4 mục nâng cao** (theo chuẩn đã chốt ở BP1 & BP2)</p><p><h3>**Screen Definition Table – FINAL**</h3></p>|
| :- |

|**Field**|**Value**|
| :-: | :-: |
|**Screen ID**|S-32|
|**Screen Name**|Listing Detail (Public)|
|**Actor**|Guest, Buyer|
|**BP**|BP3|
|**Purpose**|Hiển thị đầy đủ thông tin tin đăng để Buyer đánh giá|
|**Type**|View (State-based)|
|**Editable**|❌|
|**Editable Scope**|❌ Không cho chỉnh sửa bất kỳ dữ liệu nào|
|**Allowed Actions (CTA)**|Chat with Seller, Create Purchase / Deposit Request|
|**Forbidden Actions**|❌ Edit listing ❌ Đặt mua khi listing ≠ ACTIVE|
|**Design Constraints**|CTA phụ thuộc vai trò & trạng thái:<br>• Guest: khi bấm bất kỳ CTA nghiệp vụ nào (Chat, Đặt mua) → redirect Login<br>• Buyer: chỉ enable CTA khi listing ở trạng thái ACTIVE|
|**Entry from**|S-31 – Listing List|
|**Exit to**|S-33 – Seller Profile, S-50 – Purchase / Deposit Request|
|**Status**|DESIGN-LOCKED|

|<p>🔒 **Chốt cứng (giống S-15, S-22):**</p><p>- **Không có form**</p><p>- **Không xử lý nghiệp vụ mua tại BP3**</p><p>- Chỉ **điều hướng sang BP5**</p><p>-----</p><p><h2><a name="%f0%9f%94%b9s33%e2%80%93sellerprofile%28public%29"></a>**🔹 S-33 – Seller Profile (Public)**</h2></p><p><h3>**Screen Definition Table**</h3></p>|
| :- |

|**Field**|**Value**|
| :-: | :-: |
|**Screen ID**|S-33|
|**Screen Name**|Seller Profile (Public)|
|**Actor**|Guest, Buyer|
|**BP**|BP3|
|**Purpose**|Hiển thị thông tin công khai của Seller|
|**Type**|View|
|**Editable**|❌|
|**Shows**|Thông tin Seller, danh sách tin đang bán|
|**Primary CTA**|View Listing|
|**Entry from**|S-32 – Listing Detail (Public)|
|**Exit to**|S-32 – Listing Detail (Public)|

|<p>✅ **Rõ phạm vi:**</p><p>- Không chat</p><p>- Không đánh giá</p><p>- Không chỉnh sửa<br>  → chỉ là **public reference**</p><p><h1><a name="%f0%9f%9f%a8bp4%e2%80%93trao%c4%90%e1%bb%94ith%c3%94ngtinph%e1%bb%a4cv%e1%bb%a4ki%e1%bb%82m%c4%90%e1%bb%8anh"></a>**🟨 BP4 – TRAO ĐỔI THÔNG TIN PHỤC VỤ KIỂM ĐỊNH**</h1></p><p><h2><a name="%f0%9f%94%b9s40%e2%80%93inspectionchatthread"></a>**🔹 S-40 – Inspection Chat Thread**</h2></p><p><h3>**Screen Definition Table**</h3></p>|
| :- |

|**Field**|**Value**|
| :-: | :-: |
|**Screen ID**|S-40|
|**Screen Name**|Inspection Chat Thread|
|**Actor**|Inspector, Seller|
|**BP**|BP4|
|**Purpose**|Trao đổi thông tin phục vụ kiểm định cho **một tin đăng cụ thể**|
|**Type**|View + Message|
|**Editable**|✅ (message only)|
|**Editable Scope**|Chỉ được nhập **nội dung tin nhắn**|
|**Allowed Actions (CTA)**|Send Message|
|**Forbidden Actions**|❌ Thay đổi nội dung tin ❌ Thảo luận mua bán ❌ Chat với Buyer|
|**Design Constraints**|Chat **1–1 theo listing**, chỉ mở khi tin ở trạng thái NEED\_MORE\_INFO / UNDER\_REVIEW<br>Đây KHÔNG phải chat real-time hay chat giao dịch;<br>chỉ dùng cho trao đổi thông tin kiểm định.|
|**Entry from**|S-22 – Listing Review Detail, S-15 – Listing Detail (Seller View)|
|**Exit to**|S-41, S-42|
|**Status**|DESIGN-LOCKED|

|<p>🔒 **Chốt cho dev non tay**</p><p>- Đây **không phải chat tự do**</p><p>- Không reuse cho BP5</p><p>- Không cho Buyer vào bằng mọi cách</p><p>-----</p><p><h2><a name="%f0%9f%94%b9s41%e2%80%93inspectionrequestdetail%28inspector%29"></a>**🔹 S-41 – Inspection Request Detail (Inspector)**</h2></p><p>⚠️ **Screen decision-context → BẮT BUỘC có 4 mục nâng cao**</p><p><h3>**Screen Definition Table – FINAL**</h3></p>|
| :- |

|**Field**|**Value**|
| :-: | :-: |
|**Screen ID**|S-41|
|**Screen Name**|Inspection Request Detail|
|**Actor**|Inspector|
|**BP**|BP4|
|**Purpose**|Tạo và quản lý yêu cầu bổ sung thông tin kiểm định|
|**Type**|Action / Decision|
|**Editable**|✅|
|**Editable Scope**|Chỉ nhập **nội dung yêu cầu**, checklist câu hỏi|
|**Allowed Actions (CTA)**|Send Request|
|**Forbidden Actions**|❌ Duyệt tin ❌ Reject tin ❌ Edit nội dung listing|
|**Design Constraints**|Mỗi request gắn với **1 listing**, gửi xong → listing quay lại Seller<br>Sau khi gửi request, Inspector KHÔNG được tiếp tục duyệt cho đến khi Seller phản hồi.|
|**Entry from**|S-22 – Listing Review Detail|
|**Exit to**|S-40 – Inspection Chat Thread|
|**Status**|DESIGN-LOCKED|

|<p>📌 **Dev non tay cần hiểu rõ**</p><p>- Request Info **≠ Reject**</p><p>- Gửi request **không đổi trạng thái sang Approved**</p><p>-----</p><p><h2><a name="%f0%9f%94%b9s42%e2%80%93inspectionresponsescreen%28seller%29"></a>**🔹 S-42 – Inspection Response Screen (Seller)**</h2></p><p>⚠️ **Screen state-based → BẮT BUỘC có 4 mục nâng cao**</p><p><h3>**Screen Definition Table – FINAL**</h3></p>|
| :- |

|**Field**|**Value**|
| :-: | :-: |
|**Screen ID**|S-42|
|**Screen Name**|Inspection Response Screen|
|**Actor**|Seller|
|**BP**|BP4|
|**Purpose**|Seller phản hồi yêu cầu bổ sung thông tin từ Inspector|
|**Type**|Update (Guided)|
|**Editable**|✅|
|**Editable Scope**|Chỉ chỉnh **các field được yêu cầu**|
|**Allowed Actions (CTA)**|Submit Response|
|**Forbidden Actions**|❌ Sửa ngoài scope ❌ Gửi khi chưa đủ thông tin|
|**Design Constraints**|Chỉ mở khi listing ở trạng thái NEED\_MORE\_INFO<br>Mỗi request chỉ được submit phản hồi một lần;<br>mọi chỉnh sửa thêm phải chờ request mới từ Inspector.|
|**Entry from**|S-15 – Listing Detail (Seller View)|
|**Exit to**|S-15 – Listing Detail (Seller View)|
|**Status**|DESIGN-LOCKED|

|<p>🔒 **Chốt cho dev**</p><p>- Đây **không phải Edit Listing tự do**</p><p>- Không cho submit nếu thiếu field yêu cầu</p><p>-----</p><p><h2><a name="%f0%9f%94%b9s43%e2%80%93inspectionsummary"></a>**🔹 S-43 – Inspection Summary**</h2></p><p><h3>**Screen Definition Table**</h3></p>|
| :- |

|**Field**|**Value**|
| :-: | :-: |
|**Screen ID**|S-43|
|**Screen Name**|Inspection Summary|
|**Actor**|Inspector|
|**BP**|BP4|
|**Purpose**|Tổng hợp thông tin đã trao đổi phục vụ quyết định kiểm duyệt|
|**Type**|View|
|**Editable**|❌|
|**Shows**|Lịch sử yêu cầu – phản hồi – message|
|**Primary CTA**|Back to Review|
|**Entry from**|S-40 – Inspection Chat Thread|
|**Exit to**|S-22 – Listing Review Detail|

|<p><h1><a name="%f0%9f%9f%a9bp5%e2%80%93%c4%90%e1%ba%b6tmua%2f%c4%90%e1%ba%b6tc%e1%bb%8ccxe%28buyer%e2%86%94seller%29"></a>**🟩 BP5 – ĐẶT MUA / ĐẶT CỌC XE (Buyer ↔ Seller)**</h1></p><p><h2><a name="%f0%9f%94%b9s50%e2%80%93purchase%2fdepositrequest%28buyer%29"></a>**🔹 S-50 – Purchase / Deposit Request (Buyer)**</h2></p><p>⚠️ **Screen decision-context → BẮT BUỘC có 4 mục nâng cao**</p><p><h3>**Screen Definition Table – FINAL**</h3></p>|
| :- |

|**Field**|**Value**|
| :-: | :-: |
|**Screen ID**|S-50|
|**Screen Name**|Purchase / Deposit Request|
|**Actor**|Buyer|
|**BP**|BP5|
|**Purpose**|Tạo yêu cầu mua hoặc đặt cọc cho một listing|
|**Type**|Create (Decision)|
|**Editable**|✅|
|**Editable Scope**|Chỉ nhập loại yêu cầu (Buy / Deposit) và ghi chú|
|**Allowed Actions (CTA)**|Submit Request, Cancel|
|**Forbidden Actions**|❌ Tạo yêu cầu khi listing ≠ ACTIVE ❌ Thanh toán|
|**Design Constraints**|Mỗi listing chỉ có **1 yêu cầu ACTIVE tại một thời điểm**<br>Deposit trong BP5 chỉ là yêu cầu giữ chỗ,<br>KHÔNG phát sinh thanh toán hay giữ tiền.|
|**Entry from**|S-32 – Listing Detail (Public)|
|**Exit to**|S-51 – Transaction Summary|
|**Status**|DESIGN-LOCKED|

|<p>🔒 **Dev non tay phải hiểu**</p><p>- Đây **chưa phải thanh toán**</p><p>- Submit xong **không giữ tiền**</p><p>- Chỉ tạo **Transaction = Pending Seller Confirm**</p><p>-----</p><p><h2><a name="%f0%9f%94%b9s51%e2%80%93transactionsummary%28buyer%29"></a>**🔹 S-51 – Transaction Summary (Buyer)**</h2></p><p><h3>**Screen Definition Table**</h3></p>|
| :- |

|**Field**|**Value**|
| :-: | :-: |
|**Screen ID**|S-51|
|**Screen Name**|Transaction Summary|
|**Actor**|Buyer|
|**BP**|BP5|
|**Purpose**|Xem trạng thái yêu cầu mua/đặt cọc|
|**Type**|View (State-based)|
|**Editable**|❌|
|**Shows**|Thông tin listing, trạng thái transaction|
|**Primary CTA**|Cancel Request (conditional)<br>Cancel Request chỉ hiển thị khi trạng thái = Pending Seller Confirm.|
|**Entry from**|S-50 – Purchase / Deposit Request|
|**Exit to**|S-54 – Transaction Detail (Buyer View)|

|<p>📌 **Rule ngầm (đã khóa ở AC):**</p><p>- Chỉ cho hủy khi trạng thái = **Pending Seller Confirm**</p><p>-----</p><p><h2><a name="%f0%9f%94%b9s52%e2%80%93pendingtransactions%28seller%29"></a>**🔹 S-52 – Pending Transactions (Seller)**</h2></p><p><h3>**Screen Definition Table**</h3></p>|
| :- |

|**Field**|**Value**|
| :-: | :-: |
|**Screen ID**|S-52|
|**Screen Name**|Pending Transactions|
|**Actor**|Seller|
|**BP**|BP5|
|**Purpose**|Danh sách các yêu cầu mua/đặt cọc chờ xử lý|
|**Type**|View + Action|
|**Editable**|❌|
|**Shows**|Danh sách transaction Pending|
|**Primary CTA**|View Detail|
|**Entry from**|Seller Dashboard|
|**Exit to**|S-53 – Transaction Detail (Seller View)|

|<p>✅ **Rõ ràng:** đây là **queue xử lý**, không phải screen quyết định.</p><p>-----</p><p><h2><a name="%f0%9f%94%b9s53%e2%80%93transactiondetail%28sellerview%29"></a>**🔹 S-53 – Transaction Detail (Seller View)**</h2></p><p>⚠️ **Screen state-based / decision-context → BẮT BUỘC có 4 mục nâng cao**</p><p><h3>**Screen Definition Table – FINAL**</h3></p>|
| :- |

|**Field**|**Value**|
| :-: | :-: |
|**Screen ID**|S-53|
|**Screen Name**|Transaction Detail (Seller View)|
|**Actor**|Seller|
|**BP**|BP5|
|**Purpose**|Seller xem chi tiết yêu cầu và ra quyết định|
|**Type**|View (State-based)|
|**Editable**|❌|
|**Editable Scope**|❌ Không chỉnh sửa dữ liệu transaction|
|**Allowed Actions (CTA)**|Accept Request, Reject Request|
|**Forbidden Actions**|❌ Sửa yêu cầu ❌ Thanh toán ❌ Giao xe|
|**Design Constraints**|Chỉ xử lý khi trạng thái = Pending Seller Confirm<br>Sau khi Accept hoặc Reject, transaction trở thành read-only<br>và không được thay đổi lại quyết định.|
|**Entry from**|S-52 – Pending Transactions|
|**Exit to**|S-52 – Pending Transactions|
|**Status**|DESIGN-LOCKED|

|<p>🔒 **Chốt cứng**</p><p>- Seller **không được sửa nội dung yêu cầu**</p><p>- Accept → giữ chỗ listing (HELD)</p><p>-----</p><p><h2><a name="%f0%9f%94%b9s54%e2%80%93transactiondetail%28buyerview%29"></a>**🔹 S-54 – Transaction Detail (Buyer View)**</h2></p><p><h3>**Screen Definition Table**</h3></p>|
| :- |

|**Field**|**Value**|
| :-: | :-: |
|**Screen ID**|S-54|
|**Screen Name**|Transaction Detail (Buyer View)|
|**Actor**|Buyer|
|**BP**|BP5|
|**Purpose**|Buyer theo dõi chi tiết giao dịch|
|**Type**|View|
|**Editable**|❌|
|**Shows**|Trạng thái transaction, quyết định Seller|
|**Primary CTA**|Cancel Request (conditional)|
|**Entry from**|S-51 – Transaction Summary|
|**Exit to**|—|

|<p><h1><a name="%f0%9f%9f%aabp6%e2%80%93ho%c3%80nt%e1%ba%a4tgiaod%e1%bb%8ach%28shipper%29"></a>**🟪 BP6 – HOÀN TẤT GIAO DỊCH (Shipper)**</h1></p><p><h2><a name="%f0%9f%94%b9s60%e2%80%93shipperdashboard"></a>**🔹 S-60 – Shipper Dashboard**</h2></p><p><h3>**Screen Definition Table**</h3></p>|
| :- |

|**Field**|**Value**|
| :-: | :-: |
|**Screen ID**|S-60|
|**Screen Name**|Shipper Dashboard|
|**Actor**|Shipper|
|**BP**|BP6|
|**Purpose**|Tổng quan công việc giao hàng của Shipper|
|**Type**|View|
|**Editable**|❌|
|**Shows**|Số đơn được giao, đang giao, thất bại|
|**Primary CTA**|View Assigned Deliveries|
|**Entry from**|Login|
|**Exit to**|S-61 – Assigned Deliveries|

|<p>✅ **Chỉ điều hướng**, không xử lý nghiệp vụ.</p><p>-----</p><p><h2><a name="%f0%9f%94%b9s61%e2%80%93assigneddeliveries"></a>**🔹 S-61 – Assigned Deliveries**</h2></p><p><h3>**Screen Definition Table**</h3></p>|
| :- |

|**Field**|**Value**|
| :-: | :-: |
|**Screen ID**|S-61|
|**Screen Name**|Assigned Deliveries|
|**Actor**|Shipper|
|**BP**|BP6|
|**Purpose**|Danh sách các giao dịch được phân công giao|
|**Type**|View + Action|
|**Editable**|❌|
|**Shows**|Danh sách delivery (summary + trạng thái)|
|**Primary CTA**|View Detail|
|**Entry from**|S-60 – Shipper Dashboard|
|**Exit to**|S-62 – Delivery Detail|

|<p>📌 Đây là **queue giao hàng**, không phải screen xác nhận.</p><p>-----</p><p><h2><a name="%f0%9f%94%b9s62%e2%80%93deliverydetail"></a>**🔹 S-62 – Delivery Detail**</h2></p><p><h3>**Screen Definition Table**</h3></p>|
| :- |

|**Field**|**Value**|
| :-: | :-: |
|**Screen ID**|S-62|
|**Screen Name**|Delivery Detail|
|**Actor**|Shipper|
|**BP**|BP6|
|**Purpose**|Xem chi tiết giao dịch để thực hiện giao hàng|
|**Type**|View|
|**Editable**|❌|
|**Shows**|Thông tin Buyer, Seller, địa điểm giao|
|**Primary CTA**|Confirm Delivery, Report Failed|
|**Design Constraints**|S-62 chỉ hiển thị thông tin;<br>mọi xác nhận trạng thái BẮT BUỘC thực hiện qua S-63 hoặc S-64.|
|**Entry from**|S-61 – Assigned Deliveries|
|**Exit to**|S-63 – Delivery Confirmation, S-64 – Delivery Failed Report|

|<p>⚠️ **Chưa quyết định ở đây**, chỉ điều hướng sang screen quyết định.</p><p>-----</p><p><h2><a name="%f0%9f%94%b9s63%e2%80%93deliveryconfirmation"></a>**🔹 S-63 – Delivery Confirmation**</h2></p><p>⚠️ **Screen decision-context → BẮT BUỘC có 4 mục nâng cao**</p><p><h3>**Screen Definition Table – FINAL**</h3></p>|
| :- |

|**Field**|**Value**|
| :-: | :-: |
|**Screen ID**|S-63|
|**Screen Name**|Delivery Confirmation|
|**Actor**|Shipper|
|**BP**|BP6|
|**Purpose**|Xác nhận giao hàng thành công|
|**Type**|Action / Decision|
|**Editable**|✅|
|**Editable Scope**|Chỉ xác nhận trạng thái giao hàng|
|**Allowed Actions (CTA)**|Confirm Delivered|
|**Forbidden Actions**|❌ Sửa transaction ❌ Thanh toán ❌ Đổi Buyer/Seller|
|**Design Constraints**|Chỉ cho xác nhận khi transaction = Confirmed<br>Confirm Delivered chỉ được thực hiện MỘT LẦN; sau khi submit, transaction trở thành read-only.<br>Trường hợp giao hàng không thành công phải xử lý qua S-64,<br>KHÔNG sử dụng S-63.|
|**Entry from**|S-62 – Delivery Detail|
|**Exit to**|S-61 – Assigned Deliveries|
|**Status**|DESIGN-LOCKED|

|<p>🔒 **Dev non tay phải hiểu**</p><p>- Xác nhận ở đây → **Transaction → Completed**</p><p>- **Listing → Sold**</p><p>- Không có bước nào khác trong BP6</p><p>-----</p><p><h2><a name="%f0%9f%94%b9s64%e2%80%93deliveryfailedreport"></a>**🔹 S-64 – Delivery Failed Report**</h2></p><p>⚠️ **Screen decision-context → BẮT BUỘC có 4 mục nâng cao**</p><p><h3>**Screen Definition Table – FINAL**</h3></p>|
| :- |

|**Field**|**Value**|
| :-: | :-: |
|**Screen ID**|S-64|
|**Screen Name**|Delivery Failed Report|
|**Actor**|Shipper|
|**BP**|BP6 → BP7|
|**Purpose**|Báo cáo giao hàng thất bại|
|**Type**|Action / Decision|
|**Editable**|✅|
|**Editable Scope**|Chỉ nhập lý do giao hàng thất bại|
|**Allowed Actions (CTA)**|Submit Failure|
|**Forbidden Actions**|❌ Hoàn tất giao dịch ❌ Xử lý tranh chấp|
|**Design Constraints**|Confirm Delivered chỉ được thực hiện MỘT LẦN; sau khi submit, transaction trở thành read-only.<br>Báo cáo thất bại chỉ được submit một lần;<br>sau khi submit không cho chỉnh sửa.|
|**Entry from**|S-62 – Delivery Detail|
|**Exit to**|S-61 – Assigned Deliveries|
|**Status**|DESIGN-LOCKED|

|<p>🔒 **Chốt cứng**</p><p>- Shipper **không xử lý tranh chấp**</p><p>- Chỉ kích hoạt **BP7**</p><p><h1><a name="%f0%9f%9f%a5bp7%e2%80%93h%e1%bb%a6ygiaod%e1%bb%8ach%2fkhi%e1%ba%beun%e1%ba%a0i%2ftranhch%e1%ba%a4p%28exceptionflow%29"></a>**🟥 BP7 – HỦY GIAO DỊCH / KHIẾU NẠI / TRANH CHẤP *(Exception Flow)***</h1></p><p><h2><a name="%f0%9f%94%b9s70%e2%80%93disputecreation"></a>**🔹 S-70 – Dispute Creation**</h2></p><p>⚠️ **Screen decision-context → BẮT BUỘC có 4 mục nâng cao**</p><p><h3>**Screen Definition Table – FINAL**</h3></p>|
| :- |

|**Field**|**Value**|
| :-: | :-: |
|**Screen ID**|S-70|
|**Screen Name**|Dispute Creation|
|**Actor**|Buyer, Seller|
|**BP**|BP7|
|**Purpose**|Khởi tạo khiếu nại / tranh chấp cho một transaction|
|**Type**|Create (Decision)|
|**Editable**|✅|
|**Editable Scope**|Chỉ nhập **lý do + mô tả** khiếu nại|
|**Allowed Actions (CTA)**|Submit Dispute, Cancel|
|**Forbidden Actions**|❌ Thanh toán ❌ Giao xe ❌ Tự xử lý tranh chấp|
|**Design Constraints**|Chỉ tạo khi transaction **chưa Completed** và user **liên quan transaction**<br>Mỗi transaction chỉ được phép có MỘT dispute đang active.|
|**Entry from**|S-54 – Transaction Detail (Buyer View), S-53 – Transaction Detail (Seller View)|
|**Exit to**|S-74 – Dispute Result View|
|**Status**|DESIGN-LOCKED|

|<p>🔒 **Chốt cho dev non tay**</p><p>- Dispute **không phải chat**</p><p>- Tạo xong → **Transaction → In Dispute**</p><p>- Không cho tạo nhiều dispute cho cùng 1 transaction</p><p>-----</p><p><h2><a name="%f0%9f%94%b9s71%e2%80%93disputelist"></a>**🔹 S-71 – Dispute List**</h2></p><p><h3>**Screen Definition Table**</h3></p>|
| :- |

|**Field**|**Value**|
| :-: | :-: |
|**Screen ID**|S-71|
|**Screen Name**|Dispute List|
|**Actor**|Inspector, Admin|
|**BP**|BP7|
|**Purpose**|Danh sách các tranh chấp cần xử lý|
|**Type**|View|
|**Editable**|❌|
|**Shows**|Danh sách dispute + trạng thái|
|**Primary CTA**|View Detail|
|**Entry from**|Inspector / Admin Dashboard|
|**Exit to**|S-72 – Dispute Detail|

|<p>📌 Đây là **queue xử lý exception**, không phải screen quyết định.</p><p>-----</p><p><h2><a name="%f0%9f%94%b9s72%e2%80%93disputedetail%28inspector%29"></a>**🔹 S-72 – Dispute Detail (Inspector)**</h2></p><p>⚠️ **Screen decision-context → BẮT BUỘC có 4 mục nâng cao**</p><p><h3>**Screen Definition Table – FINAL**</h3></p>|
| :- |

|**Field**|**Value**|
| :-: | :-: |
|**Screen ID**|S-72|
|**Screen Name**|Dispute Detail|
|**Actor**|Inspector|
|**BP**|BP7|
|**Purpose**|Xem toàn bộ thông tin tranh chấp để đánh giá|
|**Type**|View (Decision Context)|
|**Editable**|❌|
|**Editable Scope**|❌ Không chỉnh sửa dữ liệu tranh chấp|
|**Allowed Actions (CTA)**|Resolve Dispute|
|**Forbidden Actions**|❌ Thanh toán ❌ Giao xe ❌ Sửa nội dung dispute|
|**Design Constraints**|Inspector **chỉ xem** tại đây; quyết định cuối **phải qua S-73**<br>Dispute Detail chỉ truy cập khi dispute ở trạng thái OPEN.|
|**Entry from**|S-71 – Dispute List|
|**Exit to**|S-73 – Dispute Resolution|
|**Status**|DESIGN-LOCKED|

|<p>🔒 **Chốt cứng**</p><p>- Không “tiện tay” xử lý ở screen này</p><p>- Không edit nội dung khiếu nại</p><p>-----</p><p><h2><a name="%f0%9f%94%b9s73%e2%80%93disputeresolution%28inspector%29"></a>**🔹 S-73 – Dispute Resolution (Inspector)**</h2></p><p>⚠️ **Screen decision-context → BẮT BUỘC có 4 mục nâng cao**</p><p><h3>**Screen Definition Table – FINAL**</h3></p>|
| :- |

|**Field**|**Value**|
| :-: | :-: |
|**Screen ID**|S-73|
|**Screen Name**|Dispute Resolution|
|**Actor**|Inspector|
|**BP**|BP7|
|**Purpose**|Ra quyết định cuối cùng cho tranh chấp|
|**Type**|Action / Decision|
|**Editable**|✅|
|**Editable Scope**|Chỉ nhập **kết luận + hướng xử lý**|
|**Allowed Actions (CTA)**|Confirm Resolution|
|**Forbidden Actions**|❌ Bỏ qua tranh chấp ❌ Thay đổi nội dung dispute|
|**Design Constraints**|Mỗi dispute **chỉ được resolve một lần**; quyết định **không đảo ngược**<br>Sau khi resolve, dispute trở thành read-only<br>và KHÔNG được phép thay đổi kết luận.<br>Mọi override (nếu có) phải do Admin thực hiện<br>ở screen riêng (không thuộc BP7 mặc định).|
|**Entry from**|S-72 – Dispute Detail|
|**Exit to**|S-71 – Dispute List|
|**Status**|DESIGN-LOCKED|

|<p>🔒 **Chốt cho dev**</p><p>- Resolve = kết thúc dispute</p><p>- Transaction → Completed **hoặc** Cancelled (theo quyết định)</p><p>-----</p><p><h2><a name="%f0%9f%94%b9s74%e2%80%93disputesresultview"></a>**🔹 S-74 – Disputes Result View**</h2></p><p><h3>**Screen Definition Table**</h3></p>|
| :- |

|**Field**|**Value**|
| :-: | :-: |
|**Screen ID**|S-74|
|**Screen Name**|Dispute Result View|
|**Actor**|Buyer, Seller|
|**BP**|BP7|
|**Purpose**|Xem kết quả giải quyết tranh chấp|
|**Type**|View|
|**Editable**|❌|
|**Shows**|Kết luận dispute, trạng thái transaction|
|**Primary CTA**|—|
|**Entry from**|Notification / Transaction Detail|
|**Exit to**|—|

|<p>✅ **View-only**, không phát sinh nghiệp vụ mới.</p><p><h1><a name="t%c3%93mt%e1%ba%aetnhanhchodev"></a>**TÓM TẮT NHANH CHO DEV**</h1></p><p>*(SWP391 – BP1 → BP7)*</p><p>-----</p><p><h2><a name="%f0%9f%94%b5nguy%c3%8ant%e1%ba%aecchung%28ph%e1%ba%a2inh%e1%bb%9a%29"></a>**🔵 NGUYÊN TẮC CHUNG (PHẢI NHỚ)**</h2></p><p>- **Mỗi BP = một phạm vi trách nhiệm**</p><p>- **Không xử lý nghiệp vụ của BP khác**</p><p>- **Không screen nào “tiện tay làm thêm”**</p><p>- **Không có thanh toán online trong hệ thống**</p><p>-----</p><p><h2><a name="%f0%9f%9f%a6bp1%e2%80%93seller%c4%91%c4%83ngtin"></a>**🟦 BP1 – Seller đăng tin**</h2></p><p>- Seller tạo & gửi tin</p><p>- Tin → Pending Approval</p><p>- ❌ Seller **không tự duyệt**</p><p>-----</p><p><h2><a name="%f0%9f%9f%a8bp2%e2%80%93inspectorduy%e1%bb%87ttin"></a>**🟨 BP2 – Inspector duyệt tin**</h2></p><p>- Inspector duyệt hoặc từ chối</p><p>- Approved → Buyer mới thấy</p><p>- ❌ Inspector **không mua/bán**</p><p>-----</p><p><h2><a name="%f0%9f%9f%a9bp3%e2%80%93buyer%2fguestxemtin"></a>**🟩 BP3 – Buyer / Guest xem tin**</h2></p><p>- **Chỉ xem**</p><p>- Guest bấm CTA → **redirect Login**</p><p>- Buyer chỉ bấm CTA khi tin = ACTIVE</p><p>- ❌ BP3 **không tạo giao dịch**</p><p>-----</p><p><h2><a name="%f0%9f%9f%a7bp4%e2%80%93trao%c4%91%e1%bb%95iki%e1%bb%83m%c4%91%e1%bb%8bnh%28supporting%29"></a>**🟧 BP4 – Trao đổi kiểm định (Supporting)**</h2></p><p>- Chat **chỉ giữa Inspector ↔ Seller**</p><p>- Chỉ phục vụ kiểm định</p><p>- ❌ Không chat Buyer</p><p>- ❌ Không chat mua bán</p><p>-----</p><p><h2><a name="%f0%9f%9f%a9bp5%e2%80%93%c4%90%e1%ba%b7tmua%2f%c4%91%e1%ba%b7tc%e1%bb%8dc"></a>**🟩 BP5 – Đặt mua / đặt cọc**</h2></p><p>- Buyer tạo **yêu cầu** (request)</p><p>- Deposit = **giữ chỗ**, ❌ **KHÔNG thu tiền**</p><p>- Seller **Accept / Reject** (1 lần)</p><p>- Accept → Listing = HELD</p><p>- ❌ BP5 **chưa giao xe**</p><p>-----</p><p><h2><a name="%f0%9f%9f%aabp6%e2%80%93giaoh%c3%a0ng%28shipper%29"></a>**🟪 BP6 – Giao hàng (Shipper)**</h2></p><p><h3><a name="%f0%9f%9a%9agiaoth%c3%80nhc%c3%94ng"></a>**🚚 GIAO THÀNH CÔNG**</h3></p><p>S-62 → S-63</p><p>Confirm Delivered (1 lần)</p><p>→ Transaction = Completed</p><p>→ Listing = Sold</p><p><h3><a name="%e2%9d%8cgiaoth%e1%ba%a4tb%e1%ba%a0i"></a>**❌ GIAO THẤT BẠI**</h3></p><p>S-62 → S-64</p><p>Submit Failure</p><p>→ Transaction = In Dispute</p><p>→ chuyển BP7</p><p>- ❌ Shipper **không xử lý tranh chấp**</p><p>- ❌ Không xác nhận lại sau khi Completed</p><p>-----</p><p><h2><a name="%f0%9f%9f%a5bp7%e2%80%93tranhch%e1%ba%a5p%2fngo%e1%ba%a1il%e1%bb%87"></a>**🟥 BP7 – Tranh chấp / ngoại lệ**</h2></p><p>- Buyer / Seller **chỉ tạo dispute**</p><p>- Inspector **quyết định cuối**</p><p>- Mỗi transaction **chỉ 1 dispute**</p><p>- Resolve xong → ❌ không sửa lại</p><p>- ❌ Không quay lại BP6</p><p>-----</p><p><h2><a name="%f0%9f%9f%a5adminoverride%28%c4%90%e1%ba%b6cbi%e1%bb%86t%29"></a>**🟥 ADMIN OVERRIDE (ĐẶC BIỆT)**</h2></p><p>- Admin **không thuộc BP7 mặc định**</p><p>- Override = **screen riêng**</p><p>- ❌ Không gắn nút override vào screen Inspector</p><p>-----</p><p><h2><a name="%f0%9f%9a%abnh%e1%bb%aengvi%e1%bb%86ctuy%e1%bb%86t%c4%90%e1%bb%90ikh%c3%94ngl%c3%80m"></a>**🚫 NHỮNG VIỆC TUYỆT ĐỐI KHÔNG LÀM**</h2></p><p>- ❌ Thu tiền khi đặt cọc</p><p>- ❌ Giao xe trong BP5</p><p>- ❌ Xử lý tranh chấp trong BP6</p><p>- ❌ Cho Buyer/Seller override quyết định Inspector</p><p>- ❌ Cho confirm / resolve nhiều lần</p><p>-----</p><p><h2><a name="%e2%9c%85c%c3%82uth%e1%ba%a6nch%c3%9achodev"></a>**✅ CÂU THẦN CHÚ CHO DEV**</h2></p><p>**“Không chắc thì KHÔNG LÀM – xem lại BP & SDT trước.”**</p><p></p>|
| :- |
Generated at Thu Jan 29 02:15:12 UTC 2026 by Lý Vũ Quốc Huy using Jira 1001.0.0-SNAPSHOT#100290-rev:3f8ec45b30b5cce2e938c1433992773ce463f3be. 
