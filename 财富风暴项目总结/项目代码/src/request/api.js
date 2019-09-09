import { get, get2, post, post2, post3, put, put2, Delete } from './http.js'
export const apiKey = params => get('gateway/key', params); // 获取m,e，合成公钥
export const apiLogin = params => post('user/member/login', params); // 登陆
export const apiRegister = params => post('user/member/register', params); // 注册
export const apiForgetpassword = params => put2('user/member/forgetPassword', params); // 忘记密码接口
export const apiModification = params => put2('user/member/password/modification', params); // 修改密码接口
export const apiSmsCaptcha = params => put2('user/member/phoneOrMail/smsCaptcha', params); // 会员绑定手机|邮箱
export const apiVerificationCode = params => get2('user/member/verificationCode', params); // 获取验证码（注册，绑定手机号和邮箱号）
export const apiAuthCode = params => get2('user/member/forget/verificationCode', params); // 获取验证码（忘记密码）
export const apiModpassCode = params => get2('user/member/modification/verificationCode', params); // 获取验证码（修改密码）

export const apiGraphics = params => get('business/graphics', params); // 图文列表首页
export const apiGraphicTypes = params => get('content/graphicTypes/all', params); // 图文导航分类
export const apiGraphic = params => get2('content/graphic/graphicId', params); // 根据ID查询图文列表
export const apiUploadMemberCoupon = params => post2('user/memberCoupon', params); // 图文和视频上传礼券

export const apiVideoCate = params => get('business/videos/videoCate', params); // 视频列表首页
export const apiVideo = params => get2('content/video/videoId', params); // 根据ID查询图文列表
export const apiVideoTypes = params => get('content/videoTypes/all', params); // 视频导航分类
export const apiProducts = params => get('business/products/productCateId', params); // 商品查询
export const apiCouponsum = params => get('business/memberCoupon/remain/memberId', params); // 查询礼券余额
export const apiMemberCoupons = params => get('business/memberCoupons', params); // 礼券明细
export const apiMemberCoupon = params => post2('user/memberCoupon', params); // 礼券充值
export const apiGetmember = params => get('business/member/memberId', params); // 根据会员ID获取会员信息
export const apiMember = params => put('user/member', params); // 根据会员ID编辑会员信息
export const apiRegions = params => get('user/regions/all', params); // 获取省市区
export const apiCreateaddress = params => post3('user/address/create', params); // 根据会员创建地址
export const apiAddress = params => put('user/address', params); // 根据地址ID修改地址
export const apiDeleteaddress = params => Delete('user/address', params); // 根据地址ID删除地址
export const apiAddresses = params => get('business/addresses', params); // 查询地址列表

export const apiOrders = params => get('business/orders', params); // 订单列表查询
export const apiDeleteOrder = params => Delete('merchant/order/orderId', params); // 订单逻辑删除
export const apiReceiveOrder = params => get2('merchant/order/receive/orderId', params); // 确认订单
export const apiCancelOrder = params => get2('merchant/order/cancel/orderId', params); // 订单取消
export const apiExpressInfo = params => get2('merchant/order/expressInfo', params); // 订单快递信息

export const apiProductName = params => get('business/products/productName', params); // 根据关键字查询商品
export const apiProductCates = params => get('merchant/productCates/all/enable', params); // 根据关键字查询商品
export const apiSearchGraphicVideos = params => get('content/searchGraphicVideos', params); // 根据关键字查询媒体
export const apiUploadPic = params => post3('content/upload/pic', params); // 上传头像
//--------------待联调--------------------