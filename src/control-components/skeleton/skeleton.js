import React  from "react";
import { Skeleton } from "@progress/kendo-react-indicators";


const CustomSkeleton=({
    shape,
    width,
    height,
    marginRight
})=>{
    return(
        <Skeleton
                  shape={!shape ? "text" : shape}
                  style={{
                    width: {width},
                    height: {height},
                    marginRight: {marginRight},
                  }}
                />
    )
}

export default CustomSkeleton;