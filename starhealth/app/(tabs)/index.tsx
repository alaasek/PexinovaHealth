import LandingPage from '../LandingPage';


export default function App() {
  return <LandingPage onStart={() => console.log('Start pressed')} />;
}
