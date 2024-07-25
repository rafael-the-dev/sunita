import { useCallback, useState } from "react"
import Image from "next/image"
import classNames from "classnames"

type PropsType = {
    alt: string;
    className?: string;
    src: string;
}

const defaultImage = `/images/default-image.png`

const ImageContainer = ({ alt, className, src }: PropsType) => {
    const [ imageSrc, setImageSrc ] = useState(src)

    const errorHandler = useCallback(
        () => setImageSrc(defaultImage),
        []
    )

    return (
        <div className={classNames(className, `relative`)}>
            <Image 
                alt={alt}
                className={classNames(`h-full object-cover w-full`)}
                fill
                onError={errorHandler}
                src={imageSrc}
            />
        </div>
    )
}

export default ImageContainer