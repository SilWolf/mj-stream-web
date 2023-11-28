import { pickImage } from '@/utils/file.util'
import { HTMLAttributes, useCallback, useMemo } from 'react'
import { useAsyncFn, useDropArea } from 'react-use'

type Props = HTMLAttributes<HTMLDivElement> & {
  helperText?: React.ReactNode
  onChangeFile?: (newFile: File) => Promise<unknown>
}

const MJUIFileDropzone = ({
  children,
  helperText,
  onChangeFile = async () => {},
  ...props
}: Props) => {
  const myChildren = useMemo(
    () =>
      children || (
        <div className="space-y-2 text-center text-xs">
          <p>
            <span className="material-symbols-outlined">upload</span>
          </p>
          <p>拖拉檔案上傳 ／ 點擊上傳</p>
          <p>{helperText}</p>
        </div>
      ),
    [children, helperText]
  )
  const [{ loading: isChanging }, onChangeFileAsyncFn] =
    useAsyncFn(onChangeFile)

  const handleClickDropArea = useCallback(() => {
    pickImage().then(onChangeFileAsyncFn)
  }, [onChangeFileAsyncFn])

  const useDropAreaProps = useMemo(
    () => ({
      onFiles: (files: File[]) => {
        const newFile = files.find((thisFile) => !!thisFile)
        if (!newFile) {
          return
        }

        onChangeFileAsyncFn(newFile)
      },
    }),
    [onChangeFileAsyncFn]
  )

  const [dropBind] = useDropArea(useDropAreaProps)

  return (
    <div className="relative">
      <div
        {...props}
        className="bg-neutral-50 border border-neutral-200 border-dashed p-1 cursor-pointer hover:border-neutral-400 text-neutral-400"
        onClick={handleClickDropArea}
        {...dropBind}
      >
        {myChildren}
      </div>
      {isChanging && (
        <div className="absolute z-10 cursor-not-allowed inset-0 bg-neutral-300 text-white flex gap-x-1 items-center justify-center">
          <span className="material-symbols-outlined animate-spin">
            progress_activity
          </span>
        </div>
      )}
    </div>
  )
}

export default MJUIFileDropzone
