import { useState } from 'react'
import { Polygon } from '../draw/Polygon'
import { InfoWindow } from '@vis.gl/react-google-maps'

type AreaProps = {
    coordinates: any,
    handleDelete: () => void
}

const Area = ({coordinates, handleDelete}: AreaProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const handleClick = (ev: any) => {
        setIsOpen(true)
    }

  return (
    <>
        <Polygon onClick={handleClick} coordinates={coordinates}/>
        {
            isOpen && (
                <InfoWindow
                    position={coordinates[0]}
                    onCloseClick={() => setIsOpen(false)}
                >
                    
                    <button onClick={handleDelete} 
                    className="outline-none m-10 flex justify-center text-center items-center bg-white shadow-[transparent_0_0_0_3px,rgba(18,18,18,0.1)_0_6px_20px] box-border text-[#121212] px-[1.2rem] py-4 rounded-xl hover:scale-110">
                        Delete
                    </button>
                </InfoWindow>
            )
        }
    </>
  )
}

export default Area