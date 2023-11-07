import { mount } from '@vue/test-utils'
import CheckboxList from '@/components/CheckboxList.vue'
import { mass1 } from './mass.js'

describe('Тестирование чекбокса "Все"', () => {
  const propsLabel = "Выбор имени"
  const propsMass = mass1
  const wrapper = mount(CheckboxList, {
    props: { 
      label: propsLabel,
      massProps: propsMass
    }
  })
  
  it('Передача props. Проверка их наличия в компоненте.', () => {
    expect(wrapper.text()).toContain(propsLabel)
    wrapper.props('massProps').forEach(item => {
      expect(wrapper.text()).toContain(item.name)
    })
  })

  it('Проверка добавления всех элементов по клику на "Все"', async () => {
    const checkbox = wrapper.get('label.checkbox-main__all input[type="checkbox"]')
    await checkbox.setChecked()
    
    let isAll = !!wrapper.vm.newMass.length    
    wrapper.vm.newMass.forEach(item => {
      if (!wrapper.props('massProps').includes(item)) {
        isAll = false
      }
    })
    expect(isAll).toBe(true)
  })

  it('Проверяем изменение текста label.', () => {
    const label = wrapper.get('label.checkbox-main__label')
    expect(label.text() !== propsLabel).toBe(true)
  })
  
  it('Проверим уберется ли чекбокс с "Все", если убрать чекбокс с одного из элементов списка', async () => {
    const firstItem = wrapper.get('label.checkbox-item input[type="checkbox"]')
    await firstItem.setChecked(false)
    const selectAllCheckbox = wrapper.get('label.checkbox-main__all input[type="checkbox"]')
    expect(selectAllCheckbox.element.checked).toBe(false)
  })

  it('Проверим появится ли чекбокс на "Все", если добавить чекбокс к последнему оставшемуся элементу списка', async () => {
    const firstItem = wrapper.get('label.checkbox-item input[type="checkbox"]')
    await firstItem.setChecked(true)
    const selectAllCheckbox = wrapper.get('label.checkbox-main__all input[type="checkbox"]')
    expect(selectAllCheckbox.element.checked).toBe(true)
  })

  it('Проверим удаления всех элементов по клику на "Все"', async () => {
    const selectAllCheckbox = wrapper.get('label.checkbox-main__all input[type="checkbox"]')
    await selectAllCheckbox.setChecked(false)
    expect(wrapper.vm.newMass).toHaveLength(0)
  })
})

describe('Тестирование модального окна', () => {
  const propsLabel = "Выбор имени"
  const propsMass = mass1
  const wrapper = mount(CheckboxList, {
    props: { 
      label: propsLabel,
      massProps: propsMass
    }
  })

  it('Проверим отображается ли модальное окно списка при клике на label.', async () => {
    const checkboxMain = wrapper.find('.checkbox-main')
    await checkboxMain.trigger('click')
    expect(wrapper.vm.isShowModal).toBe(true)
    const transition = wrapper.find('.checkbox-content')
    expect(transition.isVisible()).toBe(true)
  })

  it('Проверка на добавление каждого элемента в массив', async () => {
    const transition = wrapper.find('.checkbox-content')
    const allItem = transition.findAll('label.checkbox-item input[type="checkbox"]')
    for (const item of allItem) {
      await item.setChecked()
    }
    expect(wrapper.vm.newMass.length).toBe(propsMass.length)
  })

  it('Последующее удаление каждого элемента', async () => {
    const transition = wrapper.find('.checkbox-content')
    const allItem = transition.findAll('label.checkbox-item input[type="checkbox"]')
    for (const item of allItem) {
      await item.setChecked(false)
    }
    expect(wrapper.vm.newMass.length).toBe(0)
  })
})

import App from '@/App.vue'

describe('App.vue', () => {
  const propsLabel = "Выбор имени"
  const propsMass = mass1

  const wrapperApp = mount(App, {
    label: propsLabel,
    massProps: propsMass
  })
  const wrapperCheckbox = wrapperApp.findComponent(CheckboxList)

  it('Проверка передачи данных в App.', async () => {
    const checkboxMain = wrapperCheckbox.find('.checkbox-main')
    await checkboxMain.trigger('click')

    const allItem = wrapperCheckbox.find('label.checkbox-main__all input[type="checkbox"]')
    await allItem.setChecked()
    
    await checkboxMain.trigger('click')

    expect(JSON.stringify(wrapperApp.vm.newMass)).toBe(JSON.stringify(wrapperCheckbox.vm.newMass))
  })
})