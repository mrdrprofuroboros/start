Ext.onReady(function () {

  var reader=new Ext.data.JsonReader(
    {},[
        {name: 'id', type: 'int'},
        {name: 'first_name'},
        {name: 'last_name'},
        {name: 'email'}, 
        {name: 'phone'},
        {name: 'comment'},           
      ]
    );

  var writer = new Ext.data.JsonWriter({
      encode : true,
      rootProperty: 'data',
      writeAllFields : true,
      allowSingle: true,
      type: 'json'
  })

    Ext.define('TableRow', {
        extend: 'Ext.data.Model',
        fields: [
            { name: 'id', type: 'int', useNull: true },
            'first_name',
            'last_name',
            'email',
            'phone',
            'comment',
        ]
    });

    var urlRoot = '/data';

    var store = Ext.create('Ext.data.Store', {
        model: 'TableRow',
        pageSize: 10,
        proxy: {
            // type: 'jsonp',
            noCache: false,          
            api: {
                create:     urlRoot + '/?',
                read:       urlRoot,
                update:     urlRoot,
                destroy:    urlRoot
            },
            type: 'rest',
            reader: reader,
            writer: writer,
            listeners: { 
                exception: function(proxy, response, options) {
                    var data = Ext.decode(response.responseText);
                    var msg = '';
                    for (var key in data) {
                      msg += key + ' error: ' + data[key] + '<br>';
                    }
                    Ext.MessageBox.show({
                        title: 'Input error!',
                        msg: msg,
                    });
                }
            }
        },
    });

    var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
        clicksToEdit: 2,
        autoCancel: false,
    });
    
    var textField = {
        xtype: 'textfield',
        getSubmitValue: function(){
            var value = this.getValue();
            if(Ext.isEmpty(value)) {
                return null;
            }
            return value;
    }
    };
    
    // Определение столбцов
    var columns = [
        {
            header: 'ID',
            dataIndex: 'id',
            sortable: true,
        },
        {
            header: 'First Name',
            dataIndex: 'first_name',
            sortable: true,
            editor: textField
        },
        {
             header: 'Last Name',
             dataIndex: 'last_name',
             sortable: true,
             editor: textField
        },
        {
            header: 'Email',
            dataIndex: 'email',
            sortable: true,
            editor: textField,
            width: 100,
        },
        {
            header: 'Phone',
            dataIndex: 'phone',
            sortable: true,
            editor: textField
        },
        {
            header: 'Comment',
            dataIndex: 'comment',
            flex: 1,
            sortable: true,
            editor: textField
        },
    ];
    
    var pagingToolbar = {
        xtype: 'pagingtoolbar',
        store: store,
        displayInfo: true,
        items: [
            '-',
            {
                text: 'Save Changes',
                handler: function () {  
                    store.sync();
                }
            },
            '-',
            {
                text: 'Reject Changes',
                handler: function () {
                    store.rejectChanges();
                }
            },
            '-'
        ]
    };

    var onDelete = function () {
        var selected = grid.selModel.getSelection();
        Ext.MessageBox.confirm(
                'Confirm delete',
                'Are you sure?',
                function (btn) {
                    if (btn == 'yes') {
                        var nn = selected[0].get('id')
                        var emp = store.getProxy();
                        emp.setExtraParam("id", nn)
                        grid.store.remove(selected);                      
                        grid.store.sync();
                    }
                }
        );
    };

    var onInsertRecord = function () {
        var selected = grid.selModel.getSelection();
        rowEditing.cancelEdit();
        var newTableRow = Ext.create("TableRow");
        store.insert(selected[0].index, newTableRow);
        rowEditing.startEdit(selected[0].index, 0);
    };
    
    var doRowCtxMenu = function (view, record, item, index, e) {
        e.stopEvent();
        if (!grid.rowCtxMenu) {
            grid.rowCtxMenu = new Ext.menu.Menu({
                items: [
                    {
                        text: 'Insert Record',
                        handler: onInsertRecord
                        
                    },
                    {
                        text: 'Delete Record',
                        handler: onDelete
                    }
                ]
            });
        }
        grid.selModel.select(record);
        grid.rowCtxMenu.showAt(e.getXY());
    };

    var grid = Ext.create('Ext.grid.Panel', {
        columns: columns,
        store: store,
        loadMask: true,
        bbar: pagingToolbar,
        plugins: [rowEditing],
        stripeRows: true,
        selType: 'rowmodel',
        viewConfig: {
            forceFit: true
        },
        listeners: {
            itemcontextmenu: doRowCtxMenu,
            destroy: function (thisGrid) {
                if (thisGrid.rowCtxMenu) {
                    thisGrid.rowCtxMenu.destroy();
                }
            }
        }
    });

    Ext.create('Ext.Window', {
        title: 'Django ExtJS test',
       // icon: '/static/app/iconMgr/icons/grid.png',
        height: 350,
        width: 800,
        border: false,
        layout: 'fit',
        items: grid,
        closable: true,
        maximizable: true,      
    }).show();

    // Старт!
    store.load(); 
});

Ext.Ajax.on('beforerequest', function (conn, options) {
   if (!(/^http:.*/.test(options.url) || /^https:.*/.test(options.url))) {
     if (typeof(options.headers) == "undefined") {
       options.headers = {'X-CSRFToken': Ext.util.Cookies.get('csrftoken')};
     } else {
       options.headers.extend({'X-CSRFToken': Ext.util.Cookies.get('csrftoken')});
     }                        
   }
}, this);
