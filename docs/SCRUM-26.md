|<h3>**[SCRUM-26] [**Actor and Feature**](https://phanthanhdat2505.atlassian.net/browse/SCRUM-26)** Created: 09/Jan/26  Updated: 09/Jan/26 </h3>||
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

|**Rank:**|0|i0002f: |
| :- | :- |
|**Sprint:**||

|` `**Description**  | |
| :-: | :- |

|<p><h2><a name="%f0%9f%9f%a6seller%28ng%c6%b0%e1%bb%9dib%c3%a1n%29"></a>**🟦 Seller (Người bán)**</h2></p><p><h3><a name="%f0%9f%8e%afcorefeatures%28featurenghi%e1%bb%87pv%e1%bb%a5%29"></a>**🎯 Core Features (Feature nghiệp vụ)**</h3></p>|
| :- |

|**Feature**|**Mapping BP**|**Giới hạn quyền**|
| :-: | :-: | :-: |
|Đăng và quản lý tin đăng bán xe|BP1|Không tự duyệt|
|Bổ sung thông tin phục vụ kiểm duyệt/kiểm định|BP2, BP4|Không quyết định duyệt|
|Quyết định đối với yêu cầu mua/đặt cọc (chờ xác nhận)|BP5|Không hoàn tất giao dịch|
|Phối hợp bàn giao xe cho Shipper|BP6|Không xác nhận giao hàng|
|Tham gia hủy / tranh chấp giao dịch|BP7|Không đưa ra quyết định cuối|

|<h3><a name="%f0%9f%a7%a9supportingfeatures"></a>**🧩 Supporting Features**</h3>|
| :- |

|**Feature**|**Support BP**|
| :-: | :-: |
|Nhận thông báo về tin đăng, giao dịch|BP1–BP7|

|<p>-----</p><p><h2><a name="%f0%9f%9f%a9buyer%28ng%c6%b0%e1%bb%9dimua%29"></a>**🟩 Buyer (Người mua)**</h2></p><p><h3><a name="%f0%9f%8e%afcorefeatures"></a>**🎯 Core Features**</h3></p>|
| :- |

|**Feature**|**Mapping BP**|**Giới hạn quyền**|
| :-: | :-: | :-: |
|Tìm kiếm & xem tin đăng|BP3|Không xem tin chưa duyệt|
|Tạo yêu cầu mua / đặt cọc|BP5|Không đặt khi tin HELD|
|Theo dõi trạng thái giao dịch|BP5, BP6|Không xác nhận hoàn tất|
|Hủy yêu cầu khi đang chờ xác nhận|BP5|Không hủy sau CONFIRMED|
|Khởi tạo khiếu nại / tranh chấp|BP7|Không xử lý tranh chấp|

|<h3>**🧩 Supporting Features**</h3>|
| :- |

|**Feature**|**Support BP**|
| :-: | :-: |
|Nhận thông báo trạng thái giao dịch|BP5–BP7|

|<p>-----</p><p><h2><a name="%f0%9f%9f%a8inspector%28ng%c6%b0%e1%bb%9diki%e1%bb%83m%c4%91%e1%bb%8bnh%29"></a>**🟨 Inspector (Người kiểm định)**</h2></p><p><h3>**🎯 Core Features**</h3></p>|
| :- |

|**Feature**|**Mapping BP**|**Giới hạn quyền**|
| :-: | :-: | :-: |
|Kiểm duyệt tin đăng|BP2|Không giao hàng|
|Trao đổi thông tin phục vụ kiểm định|BP4|Không trao đổi với Buyer|
|Thực hiện kiểm định xe|BP4|Không bán/mua|
|Xử lý khiếu nại / tranh chấp|BP7|Không thanh toán|

|<h3>**🧩 Supporting Features**</h3>|
| :- |

|**Feature**|**Support BP**|
| :-: | :-: |
|Nhận thông báo về tin cần duyệt/tranh chấp|BP2, BP7|

|<p>-----</p><p><h2><a name="%f0%9f%9f%a5admin%28qu%e1%ba%a3ntr%e1%bb%8bh%e1%bb%87th%e1%bb%91ng%29"></a>**🟥 Admin (Quản trị hệ thống)**</h2></p><p><h3><a name="%f0%9f%8e%afcorefeatures%28gi%e1%bb%9bih%e1%ba%a1nr%e1%ba%a5tr%c3%b5%29"></a>**🎯 Core Features (giới hạn rất rõ)**</h3></p>|
| :- |

|**Feature**|**Mapping BP**|**Giới hạn quyền**|
| :-: | :-: | :-: |
|Quản lý người dùng & phân quyền|(Global)|Không thay Inspector|
|Override xử lý tranh chấp trong TH đặc biệt|BP7|Không actor mặc định|

|<h3>**🧩 Supporting Features**</h3>|
| :- |

|**Feature**|**Support BP**|
| :-: | :-: |
|Audit / log / thông báo hệ thống|All BP|

|<p>-----</p><p><h2><a name="%f0%9f%9f%aashipper%28ng%c6%b0%e1%bb%9digiaoh%c3%a0ng%29"></a>**🟪 Shipper (Người giao hàng)**</h2></p><p><h3>**🎯 Core Features**</h3></p>|
| :- |

|**Feature**|**Mapping BP**|**Giới hạn quyền**|
| :-: | :-: | :-: |
|Nhận xe & giao cho Buyer|BP6|Không quyết định mua bán|
|Xác nhận giao hàng thành công|BP6|Không xử lý tranh chấp|
|Đánh dấu giao hàng thất bại|BP6 → BP7|Không quyết định kết quả|

|<h3>**🧩 Supporting Features**</h3>|
| :- |

|**Feature**|**Support BP**|
| :-: | :-: |
|Nhận thông báo giao hàng|BP6|

|<p>-----</p><p><h2><a name="%e2%ac%9cguest%28kh%c3%a1chv%c3%a3nglai%29"></a>**⬜ Guest (Khách vãng lai)**</h2></p><p><h3>**🎯 Core Features**</h3></p>|
| :- |

|**Feature**|**Mapping BP**|**Giới hạn quyền**|
| :-: | :-: | :-: |
|Xem danh sách & chi tiết tin đăng|BP3|Không tạo giao dịch|

||
| :- |
Generated at Thu Jan 29 02:14:17 UTC 2026 by Lý Vũ Quốc Huy using Jira 1001.0.0-SNAPSHOT#100290-rev:3f8ec45b30b5cce2e938c1433992773ce463f3be. 
