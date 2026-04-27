import { AuthUseProvider } from "../Context/Auth"

const Dashboard = ()=>{
     const {username , authUser , token} = AuthUseProvider()

     return (
          <div className="">
               <div className="">
                    <nav className="navhorizontale">
                         <li className="">
                              <ul></ul>
                         </li>
                    </nav>
               </div>
               <div className="">

               </div>
               <div className="">

               </div>
          </div>
     )
}