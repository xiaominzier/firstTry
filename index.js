//初始化页面
function init(){
    bindEvent();
}
//绑定事件
function bindEvent(){
    var menuList = document.getElementsByClassName("menu-list")[0];//事件冒泡，点击dd切换，给dl上添加点击事件
    menuList.addEventListener('click',changeMenu,false);//菜单栏切换
    var addStudentBtn = document.getElementById('add-student-btn');
    addStudentBtn.addEventListener('click',addStudent,false);
}
function changeMenu(e){
    //console.log(e.target); //获取到dl的子元素
    var tagName = e.target.tagName; //获取到标签名称
    if(tagName == 'DD'){
        initMenuCss(e.target); //切换左侧导航栏的样式
        var id = e.target.getAttribute('data-id'); //获取左侧导航栏的自定义属性，只能通过getAttribute来获取(获取导航对应的右侧内容区的ID)
        var content = document.getElementById(id); //通过ID，获取到左侧导航栏相对应的右侧内容区元素
        initContentCss(content);  //切换右侧内容区
        if(id=='student-list'){
            renderTable();  //渲染右侧表格 （一点击，右侧表格就会刷出新的数据）
        }
    }
}
//切换左侧导航条样式
function initMenuCss(dom) {
    //把左侧class类名为active的元素删除类名，用于切换左侧导航
    var active = document.getElementsByClassName('active');
    for(var i=0; i<active.length;i++){
        active[i].classList.remove('active');// classList 把当前元素的所有类名获取到，返回的是一个伪数组
    }
    dom.classList.add('active'); //给当前点击的元素添加active类名
}
//切换右侧内容区样式
function initContentCss(dom) {
    //把右侧class类名为content-active的元素删除类名，用于相应的切换右侧区内容
    var active = document.getElementsByClassName('content-active');
    for(var i=0; i<active.length;i++){
        active[i].classList.remove('content-active');// classList 把当前元素的所有类名获取到，返回的是一个伪数组
    }
    dom.classList.add('content-active');
}

//新增学生
function addStudent(e) {
    //form表单，默认提交时，会刷新页面（缺陷）
    e.preventDefault();  //阻止表单的默认提交刷新事件
    var form = document.getElementById('add-student-form');  //获取新增表单元素
    var data = getFormData(form); //获取到表单里输入的数据
    if(!data){ //如果输入数据有误，不往下执行
        return false;
    }
    //对象的合并  Object.assign()拷贝的是属性值
    /*var result = saveData('http://api.duyiedu.com/api/student/addStudent',Object.assign(data,{appkey:'dongmeiqi_1551761333531'}));
    if(result.status == 'success'){
        var isTurnPage = window.confirm('提交成功,是否跳转页面？');
        if(isTurnPage){
            //手动触发学生列表导航的点击事件
            var studentListTab = document.getElementsByClassName('list')[0];
            studentListTab.click();
        }
        form.reset(); //重置表单
    }else{
        alert(result.msg);
    }*/
    //保存到服务器端
    transferData('/api/student/addStudent',data,function(){
        //确认弹框是否跳转页面
        var isTurnPage = window.confirm('提交成功,是否跳转页面？');
        if(isTurnPage){  //如果是，则跳转到列表页
            //手动触发学生列表导航的点击事件
            var studentListTab = document.getElementsByClassName('list')[0];
            studentListTab.click();
        }
        form.reset(); //重置表单
    })
}
// 渲染右侧表格
function renderTable() {
    // console.log(transferData('/api/student/findAll'))
    transferData('/api/student/findAll', "", function (res) {
        var data = res.data;
        var str = "";
        data.forEach(function (item, index) {  //循环数组   /*换行需要反义字符*/
            str += ' <tr>\
            <td>' + item.sNo +'</td>\
            <td>' + item.name + '</td> \
            <td>' + item.sex + '</td>\
            <td>' + item.email + '</td>\
            <td>' + item.birth + '</td>\
            <td>' + item.phone +'</td>\
            <td>' + item.address + '</td>\
            <td>\
                <button class="btn edit">编辑</button>\
                <button class="btn del">删除</button>\
            </td>\
        </tr>'
        });

        var tBody = document.getElementById('tbody');
        tBody.innerHTML = str;
    });

}
//数据交互，减少冗余
function transferData(url,data,cb){
    if(!data){
        data={};
    }
    var result = saveData('http://api.duyiedu.com'+url,Object.assign(data,{  //对象的合并  Object.assign()拷贝的是属性值
        appkey : 'dongmeiqi_1551761333531'
    }));
    if(result.status == 'success'){
        /*var isTurnPage = window.confirm('提交成功,是否跳转页面？');
        if(isTurnPage){
            //手动触发学生列表导航的点击事件
            var studentListTab = document.getElementsByClassName('list')[0];
            studentListTab.click();
        }
        form.reset(); //重置表单*/
        cb(result);  //执行回调函数
    }else{
        alert(result.msg);
    }
}
//向后端存入数据   后端的返回值是 msg 和 status
function saveData(url,param){
    var result = null;
    var xhr = null;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    if (typeof param == 'string') {
        xhr.open('GET', url + '?' + param, false);
    } else if (typeof param == 'object'){
        var str = "";
        for (var prop in param) {
            str += prop + '=' + param[prop] + '&';
        }
        xhr.open('GET', url + '?' + str, false);
    } else {
        xhr.open('GET', url + '?' + param.toString(), false);
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                result = JSON.parse(xhr.responseText);
            }
        }
    }
    xhr.send();
    return result;
}
//获取表单数据（编辑表单，新增表单）
function getFormData(form){
    var name = form.name.value;  //返回dom元素
    var sNo = form.sNo.value;
    var birth = form.birth.value;
    var sex = form.sex.value;
    var phone = form.phone.value;
    var email = form.email.value;
    var address = form.address.value;
    if(!name || !sNo || !birth || !sex || !phone || !email || !address){
        alert("部分数据未填写，请填写完成后提交");
        return false;
    }
    return {  //将获取的数据放到一个对象里
        name:name,
        sNo:sNo,
        birth:birth,
        sex:sex,
        phone:phone,
        email:email,
        address:address
    }
}
init();  //调用这个初始化函数