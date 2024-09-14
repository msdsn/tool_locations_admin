import { ControlPosition, Map, MapControl } from '@vis.gl/react-google-maps';
import { useDrawingContext } from '../draw/undo-redo';
import { useEffect, useState } from 'react';
import { db } from '../utils/firebase.ts';
import { getDocs, collection, query, deleteDoc, doc, setDoc, addDoc, QuerySnapshot, onSnapshot } from 'firebase/firestore';
import Area from './Area.tsx';
import { useDrawingManager } from '../draw/use-drawing-manager.tsx';
import { UndoRedoControl } from '../draw/undo-redo-control.tsx';
import ToolMarker from './ToolMarker.tsx';
const AdminMap = () => {
    const { state, dispatch } = useDrawingContext();
    const [initialAreas, setInitialAreas] = useState<any[]>([])
    const [initialAreasKeys, setInitialAreasKeys] = useState<any[]>([]) // store document ids in case we need to delete areas
    useEffect(() => {
        if (initialAreas.length !== 0) return;
        const q = query(collection(db, 'areas'))
        getDocs(q).then((querySnapshot) => {
            const areasData: any[] = []
            const keys: any[] = []
            querySnapshot.forEach((doc) => {
                areasData.push(doc.data()["area"])
                keys.push(doc.id)
            })
            setInitialAreas(areasData)
            setInitialAreasKeys(keys)
        })
    }, []);
    const deleteArea = (index: number) => {
        const newAreas = [...initialAreas]
        newAreas.splice(index, 1)
        setInitialAreas(newAreas)
        const key = initialAreasKeys[index]
        setInitialAreasKeys([...initialAreasKeys.slice(0, index), ...initialAreasKeys.slice(index + 1)])
        deleteDoc(doc(db, 'areas', key)).then(() => {
            console.log('Document successfully deleted!')
        }).catch((error) => {
            console.error('Error removing document: ', error)
        })
    }
    const [drawedAreas, setDrawedAreas] = useState<any[]>([])
    const [drawedAreasKeys, setDrawedAreasKeys] = useState<any[]>([])
    useEffect(() => {
        console.log("===>", state.now)
        if (!state.now || !state.now.length) return;
        if (drawedAreas.length === state.now.length) {
            // find the only updated area
            for (let i = 0; i < state.now.length; i++) {
                const overlay = state.now[i].geometry
                const area = overlay.getPath().getArray().map((latLng) => latLng.toJSON())
                if (JSON.stringify(area) !== JSON.stringify(drawedAreas[i])) {
                    // updated area
                    const key = drawedAreasKeys[i]
                    setDrawedAreas([...drawedAreas.slice(0, i), area, ...drawedAreas.slice(i + 1)])
                    setDoc(doc(db, 'areas', key), { area }, { merge: true }).then(() => {
                        console.log('Document successfully updated!')
                    }).catch((error) => {
                        console.error('Error updating document: ', error)
                    })
                    break
                }
            }
        } else {
            // new area
            const overlay = state.now[state.now.length - 1].geometry
            const area = overlay.getPath().getArray().map((latLng) => latLng.toJSON())
            setDrawedAreas([...drawedAreas, area])
            console.log({ area })
            // add timestamp to the document
            addDoc(collection(db, 'areas'), { area, timestamp: new Date().getTime() }).then((docRef) => {
                console.log('Document written with ID: ', docRef.id)
                setDrawedAreasKeys([...drawedAreasKeys, docRef.id])
            }).catch((error) => {
                console.error('Error writing document: ', error)
            })
        }
    }, [state.now])
    const [tools, setTools] = useState<any[]>([])
    useEffect(() => {
        const q = query(collection(db, 'users'))
        const unsubscribe = onSnapshot(q, (querySnapshot: QuerySnapshot) => {
            const toolsData: any[] = []
            querySnapshot.forEach((doc: any) => {
                toolsData.push(doc.data())
            })
            setTools(toolsData)
        })
        return () => unsubscribe()
    }, [])
    const drawingManager = useDrawingManager();
    return (
        <>
            <Map
                defaultZoom={ 9 }
                defaultCenter={ { lat: 40.2, lng: -74.8194 } }
                mapId='a8d4800ec43fc172'
            >
                {
                    initialAreas.map((coordinates, index) => (
                        <Area key={ index } coordinates={ coordinates } handleDelete={ () => deleteArea(index) } />
                    ))
                }
                {
                    tools.map((tool,index) => (
                        <ToolMarker key={index} tool={tool} />
                    ))
                }

            </Map>
            <MapControl position={ ControlPosition.TOP_CENTER }>
                <UndoRedoControl drawingManager={ drawingManager } />
            </MapControl>
        </>
    )
}
export default AdminMap;