export const pickImage = async () =>
  new Promise<File>((res) => {
    const element = document.createElement('input')
    element.setAttribute('type', 'file')
    element.setAttribute('accept', 'image/*')
    element.addEventListener('change', (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        res(file)
      }
    })

    element.click()
  })
