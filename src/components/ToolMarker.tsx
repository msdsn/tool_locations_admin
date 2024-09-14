import { useState } from 'react'
import { AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps'
import ToolInfoCard from './ToolInfoCard.tsx'



const ToolMarker = ({tool}: {tool: any}) => {
    const [isOpen, setIsOpen] = useState(false)
    const handleMarkerClick = (ev: any) => {
        setIsOpen(true)
    }
  return (
    <>
    <AdvancedMarker
            position={{lat: tool.location.lat, lng: tool.location.lng}}
            clickable={true}
            onClick={handleMarkerClick}
        >
            
            <img src="/blue.png" alt="marker" style={{width:'64px', height:'64px'}} />
        </AdvancedMarker>
    {
        isOpen && (
            <InfoWindow
                position={{lat: tool.location.lat, lng: tool.location.lng}}
                onCloseClick={() => setIsOpen(false)}
            >
                
                <ToolInfoCard patient={tool}/>
                
            </InfoWindow>
        )
    }
    </>
        
  )
}

export default ToolMarker