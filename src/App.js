import AppRouter from 'AppRouter';


import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faGoogle, faGithub } from '@fortawesome/free-brands-svg-icons'

import './styles/App.css'


library.add(fas, faTwitter, faGoogle, faGithub)

function App() {

  return (
    <>
    <div className="app">

        <AppRouter/>

      
    </div>
    </>
  );
}

export default App;
