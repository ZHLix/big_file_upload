<script>
import FormText from './text'
import FormSwitch from './switch'
import FormRadio from './radio'
import FormCheckbox from './checkbox'
import FormSelect from './select'
import FormCascader from './cascader'
import FormNumber from './number'
import FormSlider from './slider'
import FormTime from './time'
import FormDate from './date'
import FormEditor from './editor'
import FormImage from './image'
import FormAdd from './add'

export default {
  components: {
    FormText,
    FormSwitch,
    FormRadio,
    FormCheckbox,
    FormSelect,
    FormCascader,
    FormNumber,
    FormSlider,
    FormTime,
    FormDate,
    FormEditor,
    FormImage,
    FormAdd
  },
  props: {
    value: String | Array | Boolean | Number,
    prop: String,
    config: Object,
    global: Object
  },

  data() {
    return {
      map: {
        'input-add': 'form-add',
        'hidden': 'form-text',
        'textarea': 'form-text',
        'password': 'form-text',
        'upload-image': 'form-image',
        'datetime': 'form-date',
        'daterange': 'form-date',
        'datetimerange': 'form-date'
      }
    }
  },

  computed: {
    _config() {
      const tmp = Object.assign({}, this.config)
      delete tmp.value
      return tmp
    }
  },

  render(h) {
    const type = this.config.type ?? 'text'
    const elementName = this.map[type] ?? 'form-' + type
    return h(
      'el-form-item',
      {
        class: [this.config.type === 'hidden' ? 'hidden' : ''],
        props: Object.assign(
          {},
          {prop: this.prop, ...this.config},
          {rules: undefined}
        ),
        on: {},
        nativeOn: {
          keydown: ({key}) => {
            if (key === 'Enter') {
              this.$emit('submit')
            }
          }
        }
      },
      [
        h('el-row', {props: {type: 'flex'}}, [
          this.config?.prefixRender ? this.config.prefixRender(h) : '',
          h('el-col', [
            h(elementName, {
              props: {
                value: this.value,
                config: Object.assign({disabled: this.global.disabled, readonly: this.global.readonly}, this._config),
                global: this.global
              },
              on: {
                input: v => this.$emit('input', v)
              }
            })
          ]),
          this.config?.suffixRender ? this.config.suffixRender(h) : ''
        ])
      ]
    )
  }
}
</script>

<style
  lang="scss">
  .hidden {
    display: none;
  }
</style>