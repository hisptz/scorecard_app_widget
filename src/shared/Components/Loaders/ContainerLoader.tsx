import {CircularLoader} from '@dhis2/ui'
import React from 'react'

export default function ContainerLoader({height}:any):React.ReactElement  {

    return (
        <div style={{height: height ?? '100%', minHeight: height ?? '100%'}}
             className='column center align-items-center'>
            <CircularLoader small/>
        </div>
    )
}
