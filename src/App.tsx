import { APIProvider } from '@vis.gl/react-google-maps'
import { DrawingProvider } from './draw/undo-redo'
import AdminMap from './components/AdminMap'


function App() {
  console.log("...")
  console.log(import.meta.env)
  console.log(import.meta.env.GOOGLE_MAPS_API_KEY)
  console.log("...")
  return (
    <>
      <APIProvider apiKey={`${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`}>
          <DrawingProvider>
            <AdminMap />
          </DrawingProvider>
      </APIProvider>
    </>
  )
}

export default App
