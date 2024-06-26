<!--
 * @Date: 2024-04-04 14:37:57
 * @LastEditors: Chenqy
 * @LastEditTime: 2024-04-18 23:38:35
 * @FilePath: \Spirit-client\src\renderer\src\views\firewall\firewall-item.vue
 * @Description: True or False
-->
<template>
  <Transition name="fade" mode="out-in">
    <div v-if="!show_error" class="main-content">
      <div class="btn-groups">
        <el-button @click="addFirewallRules">{{
          i18n.global.t('firewall.btn.addrules')
        }}</el-button>
        <el-button
          :class="{
            forbid: !del_rules.length
          }"
          :disabled="!del_rules.length"
          @click="deleteChooseRules"
          >{{ i18n.global.t('firewall.btn.delrules') }}</el-button
        >
        <el-button
          class="sort-btn"
          :class="{ active: active_sort_mode }"
          @click="toggleActiveSort"
          >{{ i18n.global.t('firewall.btn.sort') }}</el-button
        >
        <Transition name="fade" mode="out-in">
          <el-button
            v-if="active_sort_mode"
            v-loading="save_loading"
            @click="firewall_store.saveList"
            >{{ i18n.global.t('firewall.btn.save') }}</el-button
          >
        </Transition>
      </div>
      <div v-if="table_data_list.length > 0" class="table-data">
        <el-table
          ref="firewall_table_ref"
          v-loading="table_loading"
          :data="table_data_list"
          class="dragTable"
          style="width: 100%"
        >
          <el-table-column width="50">
            <template #header>
              <Checkbox v-model:checked="select_page_all"></Checkbox>
            </template>
            <template #default="{ row }">
              <Checkbox
                v-model:checked="row.checked"
                @update:checked="(e) => ondelCheckChange(e, row.firewallRuleInfo)"
              ></Checkbox>
            </template>
          </el-table-column>
          <el-table-column
            v-for="(col, i) in col_template"
            :key="i"
            :prop="`firewallRuleInfo.${col.prop}`"
            :label="i18n.global.t(col.label)"
            :width="col.width"
            :show-overflow-tooltip="col.showOverflowTooltip"
            :align="col.align"
          ></el-table-column>
          <el-table-column
            width="150"
            :label="i18n.global.t('firewall.op')"
            :align="'center'"
            fixed="right"
          >
            <template #default="{ row, $index }">
              <div class="btn-groups">
                <el-button @click="() => openEditRuleDialog(row.firewallRuleInfo, $index)">{{
                  i18n.global.t('firewall.btn.edit-rule')
                }}</el-button>
                <el-button @click="() => delRule(row.firewallRuleInfo, $index)">{{
                  i18n.global.t('firewall.btn.delrule')
                }}</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <Pagination v-model:current-page="cur_page" :total="firewall_rule_list.length"></Pagination>
      </div>

      <AddFirewallRulesDialog
        :show="show_addrules_dialog"
        :firewall-config="firewallConfig!"
        @cancel="show_addrules_dialog = false"
        @confirm="onAddRulesConfirm"
      ></AddFirewallRulesDialog>
      <EditFirewallRulesDialog
        :firewallrule="edit_firewall_rule!"
        :firewall-config="firewallConfig!"
        :rule-index="edit_firewall_rule_index ?? -1"
        :show="show_editrule_dialog"
        @cancel="show_editrule_dialog = false"
        @confirm="onEditRuleConfirm"
      >
      </EditFirewallRulesDialog>
    </div>
    <div v-else>
      <el-alert
        type="error"
        :title="i18n.global.t('error.connect-server-failed')"
        :description="i18n.global.t('error.check-server-address') + ' ' + server_url"
      />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import Checkbox from '@renderer/components/checkbox/checkbox-1.vue'
import Pagination from '@renderer/components/pagination/pagination-1.vue'
import AddFirewallRulesDialog from '@renderer/views/firewall/components/add-rules.vue'
import EditFirewallRulesDialog from '@renderer/views/firewall/components/edit-rules.vue'

import { i18n } from '@renderer/plugins/i18n'
import { useFirewallStore, usePersonalSettingStore, useServerInfoStore } from '@renderer/store'
import _ from 'lodash'
import { col_template } from './template'

type TableDataItem = {
  checked: boolean
  firewallRuleInfo: FirewallRuleInfo
}

// -------------------- P R O P S -------------------- //
const props = defineProps({
  firewallConfig: {
    type: Object as PropType<FirewallConfig>,
    required: true
  }
})

// -------------------- S T O R E -------------------- //

const { win_size_setting } = storeToRefs(usePersonalSettingStore())

const { show_error, server_url } = storeToRefs(useServerInfoStore())

const firewall_store = useFirewallStore()

const { active_sort_mode, firewall_rule_list, save_loading } = storeToRefs(firewall_store)

// ----------------- C O N S T A N T ----------------- //

const page_size_map = {
  small: 8,
  medium: 10,
  large: 12
} // 每页显示条数映射

const firewall_table_ref = ref() // 表格引用

const cur_page = ref(0) // 当前页码

const del_rules = ref<FirewallRuleInfo[]>([]) // 待删除规则集合

const show_addrules_dialog = ref(false) // 展开添加规则对话框

const show_editrule_dialog = ref(false) // 展开编辑规则对话框

const edit_firewall_rule = ref<FirewallRuleInfo>() // 编辑的防火墙规则

const edit_firewall_rule_index = ref<number>() // 编辑的防火墙规则索引

const table_loading = ref(false) // 加载状态

const table_data_list = computed(() => {
  const start = cur_page.value * page_size.value
  const end = (cur_page.value + 1) * page_size.value
  return infoToTableItem(firewall_rule_list.value).slice(start, end)
}) // 表格数据

const page_size = computed(() => {
  return page_size_map[win_size_setting.value ?? 'small']
}) // 每页显示条数

// 选中所有
const select_page_all = computed({
  get() {
    return table_data_list.value.every((item) => item.checked)
  },
  set: (checked) => updateDelRules(checked)
})

// ------------------- C I R C L E ------------------- //
onMounted(() => {
  getTableData(props.firewallConfig)
  // await firewall_store.requestFirewallRules(props.firewallConfig)
})

onUnmounted(() => {
  firewall_store.clearStore()
})

// 监听防火墙配置变化 更新表格数据
watch(
  () => props.firewallConfig,
  (newConfig) => {
    getTableData(newConfig)
  }
)

// ----------------- F U N C T I O N ----------------- //

/**
 * @description:  更新删除规则
 * @param {*} selectAll
 * @return {*}
 */
const updateDelRules = (selectAll: boolean) => {
  table_data_list.value.forEach((item) => {
    if (selectAll !== item.checked) {
      item.checked = selectAll
      const index = del_rules.value.findIndex((x) => _.isEqual(x, item.firewallRuleInfo))
      if (selectAll) {
        del_rules.value.push(item.firewallRuleInfo)
      } else if (index !== -1) {
        del_rules.value.splice(index, 1)
      }
    }
  })
}

/**
 *  @description 删除选中规则
 *
 */
const deleteChooseRules = async () => {
  table_loading.value = true
  const params = {
    firewallConfig: props.firewallConfig,
    FirewallRules: del_rules.value.map((x) => firewall_store.infoToRule(x))
  }
  await window.api.delFirewallRules(params)
  del_rules.value = []

  getTableData(props.firewallConfig)
  table_loading.value = false
}

/**
 *  @description 获取表格数据
 *
 */
const getTableData = async (config: FirewallConfig) => {
  console.log('getTableData config', config)
  await firewall_store.requestFirewallRules(config)
}

/**
 *  @description 防火墙规则信息转换为表格数据
 *
 */
const infoToTableItem = (firewall_rule_info_list: FirewallRuleInfo[]) => {
  return firewall_rule_info_list.map((item) => {
    return {
      checked: false,
      firewallRuleInfo: { ...item }
    } as TableDataItem
  })
}

/**
 *  @description 规则选中状态变化 选中则添加到待删除规则集合中
 *
 */
const ondelCheckChange = (check, firewallRuleInfo) => {
  if (check) {
    del_rules.value.push(firewallRuleInfo)
  } else {
    del_rules.value.splice(
      del_rules.value.findIndex((x) => _.isEqual(x, firewallRuleInfo)),
      1
    )
  }
}

/**
 * @description 添加防火墙规则
 *
 * */
const addFirewallRules = () => {
  show_addrules_dialog.value = true
}

/**
 * @description 打开编辑规则对话框
 *
 * */
const openEditRuleDialog = (row: FirewallRuleInfo, index: number) => {
  edit_firewall_rule.value = row
  edit_firewall_rule_index.value = index
  show_editrule_dialog.value = true
}

/**
 * @description 删除防火墙规则
 *
 */
const delRule = (row: FirewallRuleInfo, index: number) => {
  const params = {
    firewallConfig: props.firewallConfig,
    FirewallRules: [firewall_store.infoToRule(row)]
  }
  firewall_rule_list.value.splice(index, 1)
  window.api.delFirewallRules(params)
}

/**
 *  @description 添加规则对话框确认
 *
 */
const onAddRulesConfirm = () => {
  show_addrules_dialog.value = false
}

//TEST
const onEditRuleConfirm = (new_firwall_rule: FirewallRuleInfo, index: number) => {
  firewall_rule_list.value[index] = new_firwall_rule
  show_editrule_dialog.value = false
}

/**
 * @description:  切换排序模式
 * @return {*}
 */
const toggleActiveSort = () => {
  const tar_el = firewall_table_ref.value.$el.querySelector('tbody')
  firewall_store.activeSortMode(tar_el)
}
</script>

<style lang="scss" scoped>
.forbid {
  color: var(--border-color) !important;
}

.apptype-header {
  display: flex;
  align-items: center;
  gap: var(--space-1x);
  span {
    width: 100%;
    text-align: center;
  }
}

.apptype-content {
  display: flex;
  align-items: center;
  gap: var(--space-1x);
  span {
    width: 100%;
    // 只显示一行
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.main-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-1x);
}
.btn-groups {
  display: flex;
  gap: var(--space-sm);
  width: max-content;
  .sort-btn {
    &.active {
      color: var(--active-color) !important;
      border-color: var(--active-color) !important;
    }
  }
}
.table-data {
  height: 100%;
  padding: var(--space-d);
  border-radius: var(--radius-sm);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
</style>
