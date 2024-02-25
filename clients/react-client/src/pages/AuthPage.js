import Header from "../components/Header";
import AuthForm from "../components/AuthForm";

function AuthPage({user, setUser}) {
  return (
    <>
      <Header />
      <AuthForm user={user} setUser={setUser} />
    </>
  )
}
  
  export default AuthPage;