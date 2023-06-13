const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: 'https://custom-tab.onrender.com'
}));
app.use(express.json());

mongoose.connect('mongodb+srv://custom_tan:varun_123@cluster0.epypnho.mongodb.net/custom_TAB?retryWrites=true&w=majority')
  .then(() => {
    console.log("DB connection successful....");
  })
  .catch((err) => {
    console.log("Error: ", err);
  });

const UserSchema = new mongoose.Schema({
  username: String,
  unqid: String,
  password: String,
});
const UserModel = mongoose.model('newUser', UserSchema);
const UserTabSchema = new mongoose.Schema({
  app_data: Array,
  tab_setting: Object,
  unqid: String
});
const AppDataModel = mongoose.model('app_data', UserTabSchema);

const UsageCount_schema=new mongoose.Schema({
  count : Number
});
const countModel=mongoose.model('UsageCount',UsageCount_schema);


const CheckDupAccount=(unq_id_check)=>{
  
}

// route to create an account ;; 
// app.get('/newAccount', (req, res) => {
//   const DataReceived = {
//     name: 'varun',
//     unqid: 'vw23ddr',
//     password: "12112",
//   }
//   UserModel.create(DataReceived);
//   const RecivedUserData_=req.body;
//   const tabData = {
//     app_data: [
//       {
//         appName: "youtube",
//         appLink: "https://www.youtube.com/",
//         appTitle: "youtube"
//       },
//       {
//         appName: 'g',
//         appLink: "https://mail.google.com/",
//         appTitle: "Gmail"
//       },
//       {
//         appName: 'm',
//         appLink: 'https://www.google.com/maps/',
//         appTitle: 'Maps'
//       },
//       {
//         appName: "google-drive",
//         appLink: 'https://drive.google.com/',
//         appTitle: "Drive"
//       }
//     ],
//     unqid: 'vw23ddr',
//     tab_setting: {
//       icon_color: '#ffffff',
//       search_eng: 'google',
//       style: 'solid',
//       bg_img: 'https://images.pexels.com/photos/1612353/pexels-photo-1612353.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
//     }
//   }
//   AppDataModel.create(tabData)
//     .then(() => {
//       console.log("Tab data created successfully.");
//       res.send('Done...');
//     })
//     .catch((err) => {
//       console.log("Error creating tab data:", err);
//       res.status(500).send('Error creating tab data.');
//     });
// });

//-------------------
// const VerifyThe_Unq=(Unq_1)=>{
// }


//======================
app.get('/', async (req, res) => {
  try {
    const updatedCount = await countModel.findByIdAndUpdate(
      '6488933da21b4d9a7625103c', // Replace with the actual ID of the document
      { $inc: { count: 1 } }, // Increment the "count" field by 1
      { new: true }
    ).exec();

    res.status(200).json({ 'message': 'SERVER ONLINE' });
  } catch (err) {
    console.error('Failed to increment the value:', err);
    res.status(500).send('Internal Server Error');
  }
});


app.post('/api', (req, res) => {
  const AllData = req.body;
  const unq_id=AllData['unqid'];
  console.log('id:',unq_id);
  console.log("Apps: ",AllData['app_data']);
  console.log("Img: ",AllData['bg_img']);
  console.log('unq:',AllData['unqid'])
  AppDataModel.find({'unqid':unq_id})
   .then(result=>{
    if(result.length===0){
      AppDataModel.create(AllData);
      res.status(200).json({message:"recived"});
    }
    else{
      AppDataModel.updateOne({'unqid': unq_id}, AllData)
        .then(()=>{
          res.status(200).json({message:"Updated"});
          console.log("updated")
        })
        .catch(error=>{
          console.log("Updating Error: ",error);
          res.status(500).json({'message':'Internal server Error'});
        })
    }
   })
  
 
});

app.post('/Send_tabInfo',(req,res)=>{
  const verUNQ_code=req.body;
  console.log(verUNQ_code);
  // const waitRes_Unq=VerifyThe_Unq(verUNQ_code);
  // console.log(waitRes_Unq);
  AppDataModel.find({'unqid':verUNQ_code.unqid})
  .then(result =>{
      if(result.length===0)
      {
          console.log("not found");  
          return res.status(404).json({message:"Not found"})
      }
      else{
          console.log(JSON.stringify(result));
          res.status(200).json({'Tab Info':(result)});
      }
  })
  .catch(err=>{
      console.log("Caught error: ",err);
  })
}
 
)

app.post('/newUser',(req,res)=>{
  const AppData_recived=req.body;
  console.log(AppData_recived['unqid'])
  UserModel.find(AppData_recived)
  .then(result=>{
    if(result.length===0)
    {
      UserModel.find({ unqid: AppData_recived['unqid'] })
      .then(res_2=>{
        if(res_2.length===0){
          res.status(200).json({'message':'User Created'});
          UserModel.create(AppData_recived);
          console.log('new User created');
        }
      })
   }
    else{
      console.log("Duplication found..",result)
      console.log('unqid',result['unqid'])
      res.status(200).json({'message':'User Found'})
    }
})
  
  console.log(AppData_recived);
  
})

app.post('/authenticate',(req,res)=>{
    const AppData_recived=req.body;
    UserModel.find({'username':AppData_recived['username']})
    .then(result=>{
      //console.log('qqw: ',result)
      if(result.length===0)
      {
        UserModel.find({ 'username': AppData_recived['username'] })
        .then(res_2=>{
            if(res_2.length===0){
              res.status(400).json({'message':'Invalied Credentials'});
            }
          })
      }
        else{
          console.log('unqid',result[0])
          UserModel.find({ 'username': AppData_recived['username'] ,'password': AppData_recived['password'] })
            .then(res_2=>{
              if(res_2.length===0)
              {
                res.status(400).json({'message':'Invalied Credentials'});
              }
              else{
                res.status(200).json({
                  'message':'User Found',
                  'unqid':res_2[0]['unqid']
                })
              }
            })
          
        }
  })
    
})

app.listen(1800, () => {
  console.log("Running on port 1800");
});
