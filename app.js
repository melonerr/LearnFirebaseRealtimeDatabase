// manage database
const database = firebase.database();
const massageRef = database.ref("massage");

const today = new Date();
const date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
const time = today.getHours() + ":" + today.getMinutes();
const dateTime = date + ' ' + time;


// VueJS
new Vue({
    el: "#comment",
    data: {
        messageText: '',
        massages: [],
        name: 'anonymous',
        title:'',
        localStorage: '',
        editText:null,
    },
    methods: {
        stroeMassage: function () {
            massageRef.push({
                text: this.messageText,
                name: this.name,
                title:this.title,
                dateTime: dateTime,
            })
            this.messageText = "";
            // this.name="";
        },
        deleteMassage: function (item) {
            massageRef.child(item.id).remove();
        },
        editMassage: function (item){
            this.editText=item
            this.messageText=item.text
        },
        CancelMassage:function(){
            this.editText=null;
            this.messageText="";
        },
        updateMassage: function (){
            massageRef.child(this.editText.id).update({text:this.messageText});
            this.CancelMassage();
        }
    },
    created() {
        // ดึงข้อมูลจาก firebase มา push ลง massages
        massageRef.on('child_added', snapshot => {
            this.massages.push({...snapshot.val(),id:snapshot.key})
        })
        massageRef.on('child_removed', snapshot => {
            // หาข้อมูลที่ซ้ำกัน (id) ใน array
            const deleteText = this.massages.find(massage=>massage.id == snapshot.key)
            // เอาข้อมูลที่ได้มาหาตำแหน่งของ array
            const index = this.massages.indexOf(deleteText)
            this.massages.splice(index,1)
        
        })
        massageRef.on('child_changed', snapshot => {
            const updateText = this.massages.find(massage=>massage.id == snapshot.key)
            updateText.text=snapshot.val().text;
            console.log(updateText.text);
        })

    },
});
