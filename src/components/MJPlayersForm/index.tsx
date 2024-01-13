import { Player, PlayerIndex } from '@/models'
import { useCallback, useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd'

const indexes = ['0', '1', '2', '3'] as const

type Props = {
  defaultPlayers: Record<PlayerIndex, Player>
}

const MJPlayersForm = ({ defaultPlayers }: Props) => {
  const { register, reset, control, getValues } = useForm<
    Props['defaultPlayers']
  >({
    defaultValues: defaultPlayers,
  })
  const imageUrls = useWatch({
    control,
    name: [
      '0.proPicUrl',
      '0.teamPicUrl',
      '1.proPicUrl',
      '1.teamPicUrl',
      '2.proPicUrl',
      '2.teamPicUrl',
      '3.proPicUrl',
      '3.teamPicUrl',
    ],
  })
  const colors = useWatch({
    control,
    name: ['0.color', '1.color', '2.color', '3.color'],
  })

  const handleDragEnd = useCallback(() => {}, [])

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

  console.log(defaultPlayers)
  console.log(getValues())

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex">
        <div className="w-8"></div>
        <div className="flex-1">
          <div className="flex font-semibold gap-2 text-center">
            <div className="flex-1"></div>
            <div className="flex-[2]">圖片</div>
            <div className="flex-[2]">隊伍</div>
            <div className="flex-[5]">隊伍名稱／稱號</div>
            <div className="flex-[5]">名稱</div>
            <div className="flex-[3]">暱稱</div>
            <div className="flex-[3]">顏色</div>
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
                      <div ref={provided.innerRef} {...provided.draggableProps}>
                        <div className="flex gap-2 py-1 items-center">
                          <div className="flex-1">
                            <div
                              className="text-2xl"
                              {...provided.dragHandleProps}
                            >
                              <i className="bi bi-grip-vertical"></i>
                            </div>
                          </div>
                          <div className="flex-[2] border border-neutral-400">
                            <img
                              className="aspect-[18/25] w-full"
                              src={imageUrls[2 * index] as string}
                              alt=""
                            />
                          </div>
                          <div className="flex-[2] border border-neutral-400">
                            <img
                              src={imageUrls[2 * index + 1] as string}
                              alt=""
                            />
                          </div>
                          <div className="flex-[5]">
                            <input
                              className="w-full"
                              {...register(`${playerIndex}.title`)}
                            />
                          </div>
                          <div className="flex-[5]">
                            <input
                              className="w-full"
                              {...register(`${playerIndex}.name`)}
                            />
                          </div>
                          <div className="flex-[3]">
                            <input
                              className="w-full"
                              {...register(`${playerIndex}.nickname`)}
                            />
                          </div>
                          <div className="flex-[3]">
                            <input
                              className="w-full"
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
        </div>
      </div>
    </DragDropContext>
  )
}

export default MJPlayersForm
