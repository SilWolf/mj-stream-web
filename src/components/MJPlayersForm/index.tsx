import { RealtimePlayer, PlayerIndex } from '@/models'
import { MouseEvent, useCallback, useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import {
  DragDropContext,
  Draggable,
  Droppable,
  OnDragEndResponder,
} from '@hello-pangea/dnd'
import MJUIButton from '../MJUI/MJUIButton'

const indexes = ['0', '1', '2', '3'] as const

type Props = {
  defaultPlayers: Record<PlayerIndex, RealtimePlayer>
  onSubmit?: (newValue: Record<PlayerIndex, RealtimePlayer>) => unknown
}

const MJPlayersForm = ({ defaultPlayers, onSubmit }: Props) => {
  const { register, reset, control, getValues, setValue } = useForm<
    Props['defaultPlayers']
  >({
    defaultValues: defaultPlayers,
  })
  const imageUrls = useWatch({
    control,
    name: [
      '0.propicUrl',
      '0.logoUrl',
      '1.propicUrl',
      '1.logoUrl',
      '2.propicUrl',
      '2.logoUrl',
      '3.propicUrl',
      '3.logoUrl',
    ],
  })
  const colors = useWatch({
    control,
    name: ['0.color', '1.color', '2.color', '3.color'],
  })

  const handleDragEnd = useCallback<OnDragEndResponder>(
    (result) => {
      // dropped outside the list
      if (!result.destination) {
        return
      }

      const orders = ['0', '1', '2', '3']

      const [removed] = orders.splice(result.source.index, 1)
      orders.splice(result.destination.index, 0, removed)

      reset({
        '0': getValues(orders[0] as PlayerIndex),
        '1': getValues(orders[1] as PlayerIndex),
        '2': getValues(orders[2] as PlayerIndex),
        '3': getValues(orders[3] as PlayerIndex),
      })
    },
    [getValues, reset]
  )

  const handleClickImage = useCallback(
    (e: MouseEvent) => {
      const index = e.currentTarget.getAttribute('data-index') as
        | '0'
        | '1'
        | '2'
        | '3'
      const type = e.currentTarget.getAttribute('data-type') as
        | 'propicUrl'
        | 'logoUrl'

      const oldValue = getValues(`${index}.${type}`)
      const newValue = prompt('新的圖片網址', oldValue ?? '')
      if (newValue !== null) {
        setValue(`${index}.${type}`, newValue)
      }
    },
    [getValues, setValue]
  )

  const handleClickReset = useCallback(() => {
    reset()
  }, [reset])

  const handleClickSubmit = useCallback(() => {
    onSubmit?.(getValues())
  }, [getValues, onSubmit])

  useEffect(() => {
    reset({
      '0': {
        ...defaultPlayers['0'],
      },
      '1': {
        ...defaultPlayers['1'],
      },
      '2': {
        ...defaultPlayers['2'],
      },
      '3': {
        ...defaultPlayers['3'],
      },
    })
  }, [defaultPlayers, reset])

  return (
    <div>
      <div className="flex">
        <div className="w-8"></div>
        <div className="flex-1">
          <div className="flex font-semibold gap-2 text-center">
            <div className="flex-1"></div>
            <div className="flex-2">圖片</div>
            <div className="flex-2">隊伍</div>
            <div className="flex-5">隊伍名稱／稱號</div>
            <div className="flex-5">名稱</div>
            <div className="flex-3">暱稱</div>
            <div className="flex-3">顏色</div>
          </div>
        </div>
      </div>

      <div className="flex">
        <div className="w-8 flex flex-col justify-around font-semibold">
          <div>東</div>
          <div>南</div>
          <div>西</div>
          <div>北</div>
        </div>
        <div className="flex-1">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {indexes.map((playerIndex, index) => (
                    <Draggable
                      key={playerIndex}
                      draggableId={playerIndex}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <div className="flex gap-2 py-1 items-center">
                            <div className="flex-1">
                              <div
                                className="text-2xl"
                                {...provided.dragHandleProps}
                              >
                                <i className="bi bi-grip-vertical"></i>
                              </div>
                            </div>
                            <div className="flex-2 border border-neutral-400">
                              <img
                                className="aspect-18/25 w-full cursor-pointer"
                                src={imageUrls[2 * index] as string}
                                onClick={handleClickImage}
                                data-type="propicUrl"
                                data-index={index}
                                alt=""
                              />
                            </div>
                            <div className="flex-2 border border-neutral-400">
                              <img
                                className="aspect-square w-full cursor-pointer"
                                src={imageUrls[2 * index + 1] as string}
                                onClick={handleClickImage}
                                data-type="teamPicUrl"
                                data-index={index}
                                alt=""
                              />
                            </div>
                            <div className="flex-5">
                              <input
                                className="w-full"
                                {...register(`${playerIndex}.secondaryName`)}
                              />
                            </div>
                            <div className="flex-5">
                              <input
                                className="w-full"
                                {...register(`${playerIndex}.primaryName`)}
                              />
                            </div>
                            <div className="flex-3">
                              <input
                                className="w-full"
                                {...register(`${playerIndex}.nickname`)}
                              />
                            </div>
                            <div className="flex-3">
                              <input
                                className="w-full text-white"
                                {...register(`${playerIndex}.color`)}
                                style={{
                                  background: colors[index],
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>

      <div className="flex mt-8">
        <MJUIButton
          className="flex-1"
          variant="text"
          color="secondary"
          onClick={handleClickReset}
        >
          重置
        </MJUIButton>
        <MJUIButton className="flex-1" onClick={handleClickSubmit}>
          儲存
        </MJUIButton>
      </div>
    </div>
  )
}

export default MJPlayersForm
