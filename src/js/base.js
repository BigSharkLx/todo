;(function(){
  'use strict';
  // 引入本地存储store.js
  var store = require('store');
  var $form_add_task=$('.add-task'),
  deleteElement,
  detailElement,
  task_list=[],
  $task_detail=$('.task-detail'),
  task_detail_mask=$('.task-detail-mask'),
  detailForm,
  inputContent,
  content,
  task_item,
  task_completed,
  inputTimePicker
  ;

  init();
  $form_add_task.on('submit' ,function(e){
    //禁用默认行为
    e.preventDefault();
    // 建立对象
    var new_task={};
    // 获取输入框的值
    var input=$(this).find('input[name=content]');
    // 设置task对象的content属性为输入框的值
    new_task.content=
    input.val();
    // 如果输入为空则返回
    if(!new_task.content) return;
    // 增加条数
    add_task_list(new_task);
    // 完成后清空输入框
    input.val(null);
  });


  function init(){
    // 初始化得到本地存储的值
    task_list=store.get('task_list')||[];
    // 渲染
    render_task_list();
  }

  // 增加条数的数组传入的参数为task对象
  function add_task_list(new_task_item){
    // 将获得的包含输出值的对象推进数组
    task_list.push(new_task_item);
    // 更新
    refresh_task_list();
  }
  // 删除条数的数组 传入的参数为当前条数的索引
  function delete_task_list(index){
    // 如果传入的数字不存在则返回
    if(index===undefined||!task_list[index]) return;
    // 删除当前对应的索引的数组键值对
    delete task_list[index];
    // 更新本地的值
    refresh_task_list();
  }
  // 渲染函数
  function render_task_list(){
    // 获取条数的容器元素
    var $task_list=$('.task-list');
    // 初始化将全部的输出清除
    $task_list.html('');
    // 遍历数组将每一条对应的html结构插入到父元素容器内
    // 新建数组保存已经完成的事件
    var complete_item=[];
    for(var i=0;i<task_list.length;i++){
      var item=task_list[i];
      // 因为数组序号不连续  有的被删掉  所以遍历全部会有的空缺
      if(!item) continue;
      // 如果点击那么complete为true 将就数组的对应元素复制给新数组的元素
      if(item && item.complete){
        complete_item[i]=item;
      }
      // 如果没点击就正常渲染在父元素容器最前面
      else{
        var module=task_list_item(task_list[i],i);
        $task_list.prepend(module);
      }
    }
    // 因为点击的元素没渲染 所以不见了 在这里重新遍历渲染在父元素容器最后面
    for(var j=0;j<complete_item.length;j++){
      if(!complete_item[j]) continue;
      module=task_list_item(complete_item[j],j);
      if(module){
        // 并且为点击的事件添加新的样式
        module.addClass("hasCompleted");
      }
      // 每一条打钩的往后插入到父元素容器
      $task_list.append(module);

    }



    // 要监听每一条的事件函数必须在渲染内操作
    deleteElement=$('.delete');
    detailElement=$('.detail');
    task_item=$('.task-item');
    task_completed=$('.task_completed');
    // 点击删除区域调用删除函数
    listen_delete();
    // 点击或双击显示详情
    listen_detail_show();
    // 隐藏
    listen_detail_hide();
    // 点击切换content的值
    listen_task_completed();
    // 时间提醒功能函数
    task_remind_check();
    // 点击暂停闹铃并隐藏提醒
    listen_confirm_know();

  }
  // 删除条数的函数
  function  listen_delete(){
    deleteElement.on('click',function(){
      // 当前删除元素的父元素的自定义属性值
      var deletIndex=$(this).parent().data('index');
      // 确认删除对话框
      var tmp= confirm('确定删除？');
      tmp? delete_task_list(deletIndex)
      :
      null;
    });
  }
  // 显示详情并渲染详情的函数
  function  listen_detail_show(){
    detailElement.on('click',function(){
      var detailIndex=$(this).parent().data('index');
      $task_detail.show();
      task_detail_mask.show();
      render_task_detail(detailIndex);

    });
    task_item.on('dblclick',function(){
      var detailIndex=$(this).data('index');
      $task_detail.show();
      task_detail_mask.show();
      render_task_detail(detailIndex);
    });

  }
  // 隐藏详情的函数
  function  listen_detail_hide(){
    task_detail_mask.on('click',function(){
      $task_detail.hide();
      task_detail_mask.hide();
    });
  }
  // 点击切换complete函数
  function listen_task_completed(){
    task_completed.on('click',function(){
      var index=$(this).parent().parent().data('index');
      var item=store.get('task_list')[index];
      if(item.complete){
        // 新建complete对象并更新
        updata_task_detail(index, {complete:false});
      }
      else{
        updata_task_detail(index, {complete:true});
      }

    });
  }
  // 点击“知道了”
  function listen_confirm_know(){
    $('.know').on('click',function(){
      $('.msg').hide();
      $('.music').get(0).pause();
    });
  }
  // 时间提醒函数
  function task_remind_check(){
    // 循环时间
    var itl=setInterval(function(){
      // 遍历每一条
      for(var i=0;i<task_list.length;i++){
        var item=store.get('task_list')[i];
        // 如果已经提醒过了或者被删除的条数就不提醒
        if(!item||!item.remind||item.informed||item.complete) continue;
        // 获取当地实际时间
        var nowTime=(new Date()).getTime();
        // 获取提醒的时间
        var remindTime=(new Date(item.remind)).getTime();
        // 如果那一条的时间到了
        if(nowTime-remindTime>=1){
          // 更新新增对象informed为true代表提醒过了
          updata_task_detail(i, {informed:true});
          // 时间就到了就显示提醒消息
          show_message(item.content);
        }
      }
    },300);
  }

  function show_message(content){
    $('.msg_content').html(content);
    $('.msg').show();
    // play是dom元素的方法 需要将jquery对象转化为dom对象
    $('.music').get(0).play();
  }









  // 渲染详情函数
  function render_task_detail(index){
    if(index===undefined||!task_list[index]) return;

    var task=task_list[index];
    // 详情模板
    var tpl=`  <form class="detailForm">
    <div class="content">
    ${task.content}
    </div>
    <div><input class="input_content" type="text" name="content" value="${task.content}"></div>
    <div class="desc">
    <textarea name="desc">${task.desc||''}
    </textarea>
    </div>
    <div class="remind">
    <input class="time_picker"  name="remind" type="text" value="${task.remind||''}"></input>
    </div>
    <button class="input_submit_button" type="submit">更新</button>
    </form>`;

    $task_detail.html('');
    $task_detail.append($(tpl));

    detailForm=$('.detailForm');
    detailForm.on('submit',function(e){
      e.preventDefault();
      // 新建data对象 表单提交之后task_list的值就由data决定 从而实现修改 描述 时间功能
      var data={};
      // data对象的三个属性
      data.content=$(this).find('[name=content]').val();
      data.desc=$(this).find('[name=desc]').val();
      data.remind=$(this).find('[name=remind]').val();
      // 更新
      updata_task_detail(index, data);
      // 表单提交完后隐藏
      $task_detail.hide();
      task_detail_mask.hide();
    });

    // 详情上方双击后显示可输入区域 自身隐藏
    inputContent=detailForm.find('[name=content]');
    content=detailForm.find('.content');
    content.on('dblclick',function(){
      inputContent.show();
      content.hide();
    });
    // 利用时间选择插件
    inputTimePicker=$('.time_picker').datetimepicker();

  }


  // 为每一条更新函数 利用extend方法保留了原来对象又可以新增对象 第一个对象是目标对象 后面的两个是源对象

  function updata_task_detail(index,data){
    if(index===undefined||!task_list[index]) return;
    task_list[index]=$.extend({},task_list[index],data);
    refresh_task_list();
  }




  // 更新本地存储函数
  function refresh_task_list(){
    store.set('task_list',task_list);
    render_task_list();
  }
  // 每一条数所对应的html结构  参数是传入的数组的值和对应的序列号
  function task_list_item(data,index){
    if(!data||!index) return;
    var list_item_tpl=
    `  <div class="task-item" data-index=${index}>
    <span><input ${data.complete ? 'checked' :'' } class="task_completed" type="checkbox"></span>
    <span class="task-content">${data.content}</span>
    <span class="action delete">删除</span>
    <span class="action detail">详情</span>
    </div>` ;
    return $(list_item_tpl) ;
  }






})();
