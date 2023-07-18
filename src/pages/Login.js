import { Grid, Paper } from "@mui/material";
import { Button, Form, Input, Modal } from "antd";
import { signInWithEmailAndPassword } from "firebase/auth";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../library/firebase/firebase";



const Login = ({userExists}) => {
    const navigate = useNavigate();

    const login = async (values) => {
        try {
          await signInWithEmailAndPassword(
            auth,
            values.email,
            values.password
          )
          .then((userCred) => {
            console.log(userCred);
            navigate("/home");
          });
        } catch (error) {
          toast.error("Password and Email do not match!", {
            duration: 3000,
          });
          console.log(error.message);
        }
    }

    const info = () => {
      Modal.info({
        title: 'Forgot Password',
        content: (
          <div>
            <p>To change your password please contact Grove County School District Administration at: 
              <p style={{fontWeight: 'bold', color: 'firebrick'}}> 555-890-4326 </p> 
               or email a request at: <p style={{fontWeight: 'bold', color: 'firebrick'}}>admin@gcsd.edu</p></p>
          </div>
        ),
    
        onOk() {},
      });
    };

    return (
        <div>
          <Toaster />
            <Grid 
            container
            justifyContent="center"
            alignItems="center"
            style={{height: '100vh',}}
            >
                <Grid item lg={4} md={6} xs={10}>
                    <Paper style={{backgroundColor: "#FCFCFC"}}>
                        <h1 className="text-center pt-5 p-2">Login</h1>
                        <div className="d-flex justify-content-center align-items-center pb-5">
                            {userExists? 
                            <div>
                                <h4 className="text-center">You have already logged in!</h4>
                                <h4 className="text-center mt-5">
                                    <Link to='/'>Back To Home</Link>
                                </h4>
                            </div>
                            : 
                            <Form 
                            labelCol={{md: {span: 7}, lg: { span: 7},}}
                            layout="vertical"
                            onFinish={login}  
                            className="col-xxl-6 col-sm-8 col-10">
                                <Form.Item
                                label="Email"
                                name="email"
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                label="Password"
                                name="password"
                                >
                                    <Input.Password />
                                </Form.Item>

                                <p className="text-center" onClick={info}>Forgot Password?</p>

                                <Form.Item className="d-flex justify-content-center mt-4">
                                <Button size="large" type="primary" htmlType="submit">Login</Button>
                                </Form.Item>
                            </Form>
                            }
                        </div>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    )
}

export default Login;