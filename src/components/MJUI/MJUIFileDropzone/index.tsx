import {
  ChangeEvent,
  HTMLAttributes,
  useCallback,
  useMemo,
  useRef,
} from 'react'
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
  const inputRef = useRef<HTMLInputElement>(null)
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
  const [, onChangeFileAsyncFn] = useAsyncFn(onChangeFile)

  const handleClickDropArea = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const handleFileInputBlur = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newFile = [...(e.currentTarget.files ?? [])].find(
        (thisFile) => !!thisFile
      )
      if (!newFile) {
        return
      }

      onChangeFileAsyncFn(newFile)
    },
    [onChangeFileAsyncFn]
  )

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
    <div
      {...props}
      className="bg-neutral-50 border border-neutral-200 border-dashed p-4 cursor-pointer hover:border-neutral-400 text-neutral-400"
      onClick={handleClickDropArea}
      {...dropBind}
    >
      {myChildren}
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        onChange={handleFileInputBlur}
        accept="image/*"
      />
    </div>
  )
}

export default MJUIFileDropzone
