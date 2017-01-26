Ext.define('Writer.Form', {
    extend: 'Ext.form.Panel',
    alias: 'widget.writerform',

    requires: ['Ext.form.field.Text'],

    initComponent: function(){
        Ext.apply(this, {
            activeRecord: null,
            iconCls: 'icon-user',
            frame: true,
            title: 'Contact -- All fields except "comment" are required',
            defaultType: 'textfield',
            bodyPadding: 5,
            fieldDefaults: {
                anchor: '100%',
                labelAlign: 'right'
            },
            items: [{
                fieldLabel: 'First Name',
                name: 'first_name',
                allowBlank: false
            }, {
                fieldLabel: 'Last Name',
                name: 'last_name',
                allowBlank: false
            }, {
                fieldLabel: 'Email',
                name: 'email',
                allowBlank: false,
                vtype: 'email'
            }, {
                fieldLabel: 'Phone',
                name: 'phone',
                allowBlank: false
            }, {
                fieldLabel: 'Comment',
                name: 'comment',
                allowBlank: true
            }],
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                ui: 'footer',
                items: ['->', {
                    iconCls: 'icon-save',
                    itemId: 'save',
                    text: 'Save',
                    disabled: true,
                    scope: this,
                    handler: this.onSave
                }, {
                    iconCls: 'icon-user-add',
                    text: 'Create',
                    scope: this,
                    handler: this.onCreate
                }, {
                    iconCls: 'icon-reset',
                    text: 'Reset',
                    scope: this,
                    handler: this.onReset
                }]
            }]
        });
        this.callParent();
    },

    setActiveRecord: function(record){
        this.activeRecord = record;
        if (record) {
            this.down('#save').enable();
            this.getForm().loadRecord(record);
        } else {
            this.down('#save').disable();
            this.getForm().reset();
        }
    },

    onSave: function(){
        var active = this.activeRecord,
            form = this.getForm();

        if (!active) {
            return;
        }
        if (form.isValid()) {
            form.updateRecord(active);
            this.onReset();
        }
    },

    onCreate: function(){
        var form = this.getForm();

        if (form.isValid()) {
            this.fireEvent('create', this, form.getValues());
            form.reset();
        }

    },

    onReset: function(){
        this.setActiveRecord(null);
        this.getForm().reset();
    }
});

Ext.define('Writer.Grid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.writergrid',

    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.form.field.Text',
        'Ext.toolbar.TextItem'
    ],

    initComponent: function(){

        this.editing = Ext.create('Ext.grid.plugin.CellEditing');

        Ext.apply(this, {
            visibleRows: 10,
            iconCls: 'icon-grid',
            frame: true,
            plugins: [this.editing],
            dockedItems: [{
                xtype: 'toolbar',
                items: [{
                    iconCls: 'icon-add',
                    text: 'Add',
                    scope: this,
                    handler: this.onAddClick
                }, {
                    iconCls: 'icon-delete',
                    text: 'Delete',
                    disabled: true,
                    itemId: 'delete',
                    scope: this,
                    handler: this.onDeleteClick
                }]
            }, {
                weight: 1,
                xtype: 'toolbar',
                dock: 'bottom',
                ui: 'footer',
                items: ['->', {
                    iconCls: 'icon-save',
                    text: 'Sync',
                    scope: this,
                    handler: this.onSync
                }]
            }],
            columns: [{
                text: 'ID',
                width: 40,
                sortable: true,
                resizable: false,
                draggable: false,
                hideable: false,
                menuDisabled: true,
                dataIndex: 'id'
            }, {
                header: 'First Name',
                width: 100,
                sortable: true,
                dataIndex: 'first_name',
                field: {
                    type: 'textfield'
                }
            }, {
                header: 'Last Name',
                width: 100,
                sortable: true,
                dataIndex: 'last_name',
                field: {
                    type: 'textfield'
                }
            }, {
                header: 'Email',
                flex: 1,
                sortable: true,
                dataIndex: 'email',
                field: {
                    type: 'textfield'
                }
            }, {
                header: 'Phone',
                width: 100,
                sortable: true,
                dataIndex: 'phone',
                field: {
                    type: 'textfield'
                }
            }, {
                header: 'Comment',
                width: 100,
                sortable: true,
                dataIndex: 'comment',
                field: {
                    type: 'textfield'
                }
            }],

        });
        this.callParent();
        this.getSelectionModel().on('selectionchange', this.onSelectChange, this);
    },
    
    onSelectChange: function(selModel, selections){
        this.down('#delete').setDisabled(selections.length === 0);
    },

    onSync: function(){
        this.store.sync();
    },

    onDeleteClick: function(){
        var selection = this.getView().getSelectionModel().getSelection()[0];
        if (selection) {
            this.store.remove(selection);
        }
    },

    onAddClick: function(){
        var rec = new Writer.Person({
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            comment: ''
        }), edit = this.editing;

        edit.cancelEdit();
        this.store.insert(0, rec);
        edit.startEditByPosition({
            row: 0,
            column: 1
        });
    }
});

Ext.define('Writer.Person', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'id', type: 'int', useNull: true },
        'first_name',
        'last_name',
        'email',
        'phone',
        'comment',
    ],
});

Ext.require([
    'Ext.data.*',
    'Ext.tip.QuickTipManager',
    'Ext.window.MessageBox'
]);

Ext.onReady(function(){
    Ext.tip.QuickTipManager.init();
    
    var urlRoot = '/data';

    var store = Ext.create('Ext.data.Store', {
        model: 'Writer.Person',
        autoLoad: true,
        autoSync: false, 
        batch: true,
        proxy: {
            // type: 'jsonp',
            noCache: false,
            api: {
                create:     urlRoot + '/',
                read:       urlRoot,
                update:     urlRoot,
                destroy:    urlRoot
            },
            type: 'rest',
            reader: {   
                type: 'json',
                successProperty: 'success',
                rootProperty: 'data',
                messageProperty: 'message'
            },
            writer: {
                type: 'json',
                writeAllFields: false,
                rootProperty: 'data'
            },
            listeners: { 
                exception: function(proxy, response, options) {
                    var data = Ext.decode(response.responseText).data;
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
    
    // var store = Ext.create('Ext.data.Store', {
    //     model: 'Writer.Person',
    //     autoLoad: true,
    //     autoSync: true,
    //     proxy: {
    //         type: 'ajax',
    //         api: {
    //             read: 'app.php/users/view',
    //             create: 'app.php/users/create',
    //             update: 'app.php/users/update',
    //             destroy: 'app.php/users/destroy'
    //         },
    //         reader: {   
    //             type: 'json',
    //             successProperty: 'success',
    //             root: 'data',
    //             messageProperty: 'message'
    //         },
    //         writer: {
    //             type: 'json',
    //             writeAllFields: false,
    //             root: 'data'
    //         },
    //         listeners: {
    //             exception: function(proxy, response, operation){
    //                 Ext.MessageBox.show({
    //                     title: 'REMOTE EXCEPTION',
    //                     msg: operation.getError(),
    //                     icon: Ext.MessageBox.ERROR,
    //                     buttons: Ext.Msg.OK
    //                 });
    //             }
    //         }
    //     },
    //     listeners: {
    //         write: function(proxy, operation){
    //             if (operation.action == 'destroy') {
    //                 main.child('#form').setActiveRecord(null);
    //             }
    //             Ext.example.msg(operation.action, operation.resultSet.message);
    //         }
    //     }
    // });

    var main = Ext.create('Ext.container.Container', {
        padding: '0 0 0 20',
        width: 700,
        height: 700,
        renderTo: document.body,
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        items: [{
            itemId: 'form',
            xtype: 'writerform',
            manageHeight: false,
            margins: '0 0 10 0',
            listeners: {
                create: function(form, data){
                    store.insert(0, data);
                }
            }
        }, {
            itemId: 'grid',
            xtype: 'writergrid',
            title: 'Contact List',
            flex: 1,
            store: store,
            listeners: {
                selectionchange: function(selModel, selected) {
                    main.child('#form').setActiveRecord(selected[0] || null);
                }
            }
        }]
    });
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
