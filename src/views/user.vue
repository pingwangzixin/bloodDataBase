<template>
	<div class="content">
		<div class="app-container calendar-list-container">

			<!-- 筛选查询 -->
			<div class="filter-container">
				<div class="fl">
					患者姓名
					<el-input class="inputWidth" v-model="ptusername" placeholder="请输入" @input="widthCheck()" clearable></el-input>
					<span class="mtltwo">联系方式</span>
					<el-input class="inputWidth" v-model="ptelphone" placeholder="请输入" clearable></el-input>
				</div>
				<div class="fr">
					<el-button style="margin-right:10px;" class="filter-item" type="primary" icon="search" @click="handleFilter(ptusername,ptelphone)">查询</el-button>
					<el-button class="button " v-if="expotAll" @click="exportExcel" type="primary">导出</el-button>
				</div>
			</div>
			<hr>
			<!-- 新增患者 -->
			<div class="clearfix patwo">
				<el-button class="filter-item" @click="handleCreate" type="primary" icon="edit">新增患者</el-button>
			</div>
			<!-- 表格！！！！ -->
			<el-table ref="msgDiv" class="table" :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border
			 fit highlight-current-row style="width: 100%">
				<el-table-column align="center" label="患者姓名">
					<template slot-scope="scope">
						<span>{{ scope.row.name }}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="性别">
					<template slot-scope="scope">
						<span v-if="scope.row.sex==1">男</span>
						<span v-if="scope.row.sex==0">女</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="年龄">
					<template slot-scope="scope">
						<span>{{ scope.row.age }}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="身高（Cm)">
					<template slot-scope="scope">
						<span>{{ scope.row.stature }}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="体重(KG)">
					<template slot-scope="scope">
						<span>{{ scope.row.weight }}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="BMI（kg/m²）">
					<template slot-scope="scope">
						<span>{{scope.row.bmi}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="体表面积">
					<template slot-scope="scope">
						<span>{{scope.row.bodyArea}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="联系方式">
					<template slot-scope="scope">
						<span>{{ scope.row.mobile }}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="血型">
					<template slot-scope="scope">
						<span v-if="scope.row.bloodType==1">A型</span>
						<span v-if="scope.row.bloodType==2">B型</span>
						<span v-if="scope.row.bloodType==3">AB型</span>
						<span v-if="scope.row.bloodType==4">O型</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="既往史">
					<template slot-scope="scope">
						<span>{{ scope.row.lhistory }}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="ECOG评分">
					<template slot-scope="scope">
						<span>{{ scope.row.ecog }}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="操作">
					<template slot-scope="scope">
						<el-button size="small" type="success" @click="handleUpdate(scope.row.id)">查看详情
						</el-button>
					</template>
				</el-table-column>
			</el-table>

			<!-- 分页 -->
			<div v-show="!listLoading" class="pagination-container" style="margin-top:20px;">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
				 :page-sizes="[10,20,30,50]" :page-size="listQuery.rows" layout="total, sizes, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</div>

			<!-- 弹窗！！！ -->
			<el-dialog :visible.sync="dialogFormVisible" width="1000px"  @close='closeDialog'>
				<el-form :model="form" :rules="rules" ref="form">
					<el-form-item v-show="false" label="主键id" prop="id" v-if="dialogStatus == 'update'">
						<el-input v-model="form.id" placeholder="主键id" :disabled="true"></el-input>
					</el-form-item>
					<!-- 表单选项卡 -->
					<el-tabs v-model="activeName" @tab-click="handleClick">
						<el-tab-pane label="基本信息" name="first" class="mttwo">
							<!-- 表单 血常规-->
							<el-form :inline="true" :model="addForm" status-icon :rules="rules" ref="addForm" label-width="100px" class="demo-ruleForm dashedB formPosition userInfo">
								<el-form-item label="患者姓名" prop="name">
									<el-input v-model.number="addForm.name" placeholder="请输入"></el-input>
								</el-form-item>
								<el-form-item label="年龄" prop="age">
									<el-input v-model.number="addForm.age" placeholder="请输入"></el-input>
								</el-form-item>
								<el-form-item label="性别" prop="sex">
									<el-select v-model="addForm.sex" placeholder="请选择">
										<el-option v-for="item in sex" :key="item.id" :label="item.name" :value="item.id"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="血型" prop="bloodType">
									<el-select v-model="addForm.bloodType" placeholder="请选择">
										<el-option v-for="item in bloodType" :key="item.id" :label="item.name" :value="item.id"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="身高CM" prop="stature">
									<el-input v-model.number="addForm.stature" placeholder="请输入" @blur="stature()"></el-input>
								</el-form-item>
								<el-form-item label="体重KG" prop="weight">
									<el-input v-model.number="addForm.weight" placeholder="请输入" @blur="weight()"></el-input>
								</el-form-item>
								<el-form-item label="体表面积" prop="">
									<el-input placeholder="自动生成" v-model="addForm.bodyArea"></el-input>
								</el-form-item>
								<el-form-item label="BMI" prop="">
									<el-input placeholder="自动生成" v-model="addForm.bmi"></el-input>
								</el-form-item>
								<el-form-item label="联系方式" prop="mobile">
									<el-input v-model.number="addForm.mobile" placeholder="请输入"></el-input>
								</el-form-item>
								<el-form-item label="既往史" prop="lhistory">
									<el-input v-model.number="addForm.lhistory" placeholder="请输入"></el-input>
								</el-form-item>
								<el-form-item label="ECOG评分" prop="ecog">
									<el-select v-model="addForm.ecog" placeholder="请选择">
										<el-option v-for="item in ecog" :key="item.id" :label="item.name" :value="item.id"></el-option>
									</el-select>
								</el-form-item>
							</el-form>
							<el-form-item class="submitBtn">
								<el-button @click="resetForm('addForm')">取消</el-button>
								<el-button type="primary" v-if="dialogStatus=='create'" @click="submitForm('addForm')">保存</el-button>
								<el-button type="primary" v-if="dialogStatus=='update'" @click="submitUpdateForm('addForm')">保存</el-button>
							</el-form-item>
						</el-tab-pane>

						<el-tab-pane label="实验室检查" name="second" class="mttwo">
							<!-- 表单 血常规 -->
							<el-form :inline="true" :model="saveExamineForm" status-icon :rules="rules" ref="saveExamineForm" label-width="130px"
							 class="demo-ruleForm dashedB formPosition xuechang">
								<el-form-item label="WBC（×10^9/L）" prop="wbc">
									<el-input v-model.number="saveExamineForm.wbc" placeholder="请输入"></el-input>
								</el-form-item>
								<el-form-item label="ANC（×10^9/L）" prop="anc">
									<el-input v-model.number="saveExamineForm.anc" placeholder="请输入"></el-input>
								</el-form-item>
								<el-form-item label="HG（g/L）" prop="hg">
									<el-input v-model.number="saveExamineForm.hg" placeholder="请输入"></el-input>
								</el-form-item>
								<el-form-item label="MCV（fL）" prop="mcv">
									<el-input v-model.number="saveExamineForm.mcv" placeholder="请输入"></el-input>
								</el-form-item>
								<el-form-item label="MCH（pg）" prop="mch">
									<el-input v-model.number="saveExamineForm.mch" placeholder="请输入"></el-input>
								</el-form-item>
								<el-form-item label="MCHC（g/L）" prop="mchc">
									<el-input v-model.number="saveExamineForm.mchc" placeholder="请输入"></el-input>
								</el-form-item>
								<el-form-item label="RDWSD（%）" prop="rdwsd">
									<el-input v-model.number="saveExamineForm.rdwsd" placeholder="请输入"></el-input>
								</el-form-item>
								<el-form-item label="RDWCV（×10^9/L）" prop="rdwcv">
									<el-input v-model.number="saveExamineForm.rdwcv" placeholder="请输入"></el-input>
								</el-form-item>
								<el-form-item label="PLT（×10^9/L）" prop="plt">
									<el-input v-model.number="saveExamineForm.plt" placeholder="请输入"></el-input>
								</el-form-item>
								<el-form-item label="LYMPHN（×10^9/L）" prop="lymphn">
									<el-input v-model.number="saveExamineForm.lymphn" placeholder="请输入"></el-input>
								</el-form-item>
							</el-form>
							<!-- 表单 生化 -->
							<el-form :inline="true" :model="saveExamineForm" status-icon ref="saveExamineForm" label-width="150px" class="demo-ruleForm dashedB formPosition shenghua">
								<el-form-item label="铁蛋白（ng/ml）" prop="egg">
									<el-input v-model.number="saveExamineForm.egg" placeholder="请输入"></el-input>
								</el-form-item>
								<el-form-item label="乳酸脱氢酶（v/L）" prop="lactic">
									<el-input v-model.number="saveExamineForm.lactic" placeholder="请输入"></el-input>
								</el-form-item>
								<el-form-item label="血沉（mm/h）" prop="eryt">
									<el-input v-model.number="saveExamineForm.eryt" placeholder="请输入"></el-input>
								</el-form-item>
								<el-form-item label="β₂-MG（mg/L）" prop="b2mg">
									<el-input v-model.number="saveExamineForm.b2mg" placeholder="请输入"></el-input>
								</el-form-item>
								<el-form-item label="ALT（v/L）" prop="alt">
									<el-input v-model.number="saveExamineForm.alt" placeholder="请输入"></el-input>
								</el-form-item>
								<el-form-item label="AST（v/L）" prop="ast">
									<el-input v-model.number="saveExamineForm.ast" placeholder="请输入"></el-input>
								</el-form-item>
								<el-form-item label="总胆红素（μmol/L）" prop="tbil">
									<el-input v-model.number="saveExamineForm.tbil" placeholder="请输入"></el-input>
								</el-form-item>
								<el-form-item label="直接胆红素（μmol/L）" prop="direct">
									<el-input v-model.number="saveExamineForm.direct" placeholder="请输入"></el-input>
								</el-form-item>
								<el-form-item label="间接胆红素（μmol/L）" prop="indirect">
									<el-input v-model.number="saveExamineForm.indirect" placeholder="请输入"></el-input>
								</el-form-item>
							</el-form>
							<el-form-item  class="submitBtn">
								<el-button @click="resetForm('ruleForm')">取消</el-button>
								<el-button type="primary" @click="submitOtherForm('saveExamineForm')">保存</el-button>
							</el-form-item>
						</el-tab-pane>

						<el-tab-pane label="MICM" name="third" class="mttwo">
							<!-- 表单 发病时骨髓心疼 -->
							<el-form :model="saveMicmForm" status-icon :rules="rules" ref="saveMicmForm" label-width="150px" class="demo-ruleForm dashedB formPosition gusui">
								<!-- 发病时骨髓形态 -->
								<el-form-item label="增生程度" prop="degree">
									<el-select v-model="saveMicmForm.degree" placeholder="请选择">
										<el-option v-for="item in degree" :key="item.id" :label="item.name" :value="item.id"></el-option>
									</el-select>
								</el-form-item>

								<el-form-item label="病态造血" prop="morbi" class="morbi">
									  <span class="fuheInput">红系</span>
									  <el-select v-model="saveMicmForm.morbiRed" placeholder="请选择" class="inlineShow">
									  	<el-option v-for="item in morbiRed" :key="item.id" :label="item.name" :value="item.id"></el-option>
									  </el-select>
									  <span class="fuheInput">粒系</span>
									  <el-select v-model="saveMicmForm.morbiGrain" placeholder="请选择"  class="inlineShow">
									  	<el-option v-for="item in morbiGrain" :key="item.id" :label="item.name" :value="item.id"></el-option>
									  </el-select>
									  <span class="fuheInput">巨核系</span>
									  <el-select v-model="saveMicmForm.morbiHuge" placeholder="请选择"  class="inlineShow">
									  	<el-option v-for="item in morbiHuge" :key="item.id" :label="item.name" :value="item.id"></el-option>
									  </el-select>
								</el-form-item>
								<!-- TODO -->
								<el-form-item label="PB原始细胞比例(%)" prop="pbProtocell">
									<el-input v-model.number="saveMicmForm.pbProtocell" placeholder="请输入"></el-input>
								</el-form-item>
								<el-form-item label="原始细胞比例" prop="protocellGs">
									<el-input placeholder="请输入内容" v-model="saveMicmForm.protocellGs">
									    <template slot="prepend">骨髓</template>
									</el-input>
									<el-input placeholder="请输入内容" v-model="saveMicmForm.protocellWzx">
									    <template slot="prepend">外周血</template>
									</el-input>
								</el-form-item>
							</el-form>
							<!-- 表单 免疫分型 √-->
							<el-form :inline="true" :model="saveMicmForm" status-icon :rules="rules" ref="saveMicmForm" label-width="150px"
							 class="demo-ruleForm dashedB formPosition mianyi">
								<el-form-item label="原始细胞比例(%)" prop="protocell">
									<el-input v-model.number="saveMicmForm.protocell" placeholder="请输入"></el-input>
								</el-form-item>
								<el-form-item label="LAIP表达" prop="laip">
									<el-input v-model.number="saveMicmForm.laip" placeholder="请输入"></el-input>
								</el-form-item>
							</el-form>
							<!-- 表单 基因 -->
							<el-form :inline="true" :model="saveMicmForm" status-icon :rules="rules" ref="saveMicmForm" label-width="150px"
							 class="demo-ruleForm dashedB formPosition jiyin">
								<el-form-item label="融合基因" prop="fusionGene">
									<el-select v-model="saveMicmForm.fusionGene" placeholder="请选择">
										<el-option v-for="item in fusionGene" :key="item.id" :label="item.name" :value="item.id"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="突变基因" prop="mutantGene">
									<el-select v-model="saveMicmForm.mutantGene" placeholder="请选择">
										<el-option v-for="item in mutantGene" :key="item.id" :label="item.name" :value="item.id"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="WTI(×10^4ABL拷贝数)" prop="wti">
									<el-input v-model.number="saveMicmForm.wti" placeholder="请输入"></el-input>
								</el-form-item>
								<el-form-item label="其他" prop="rest">
									<el-input v-model.number="saveMicmForm.rest" placeholder="请输入"></el-input>
								</el-form-item>
							</el-form>
							<!-- 表单 染色体 -->
							<el-form :inline="true" :model="saveMicmForm" status-icon :rules="rules" ref="saveMicmForm" label-width="150px"
							 class="demo-ruleForm dashedB formPosition ranseti">
								<el-form-item label="染色体" prop="chromosome">
									<el-select v-model="saveMicmForm.chromosome" placeholder="请选择">
										<el-option label="正常男性" value="1"></el-option>
										<el-option label="正常女性" value="2"></el-option>
										<el-option label="异常" value="3"></el-option>
									</el-select>
								</el-form-item>
							</el-form>
							<!-- 表单 FISH -->
							<el-form :inline="true" :model="saveMicmForm" status-icon :rules="rules" ref="saveMicmForm" label-width="150px"
							 class="demo-ruleForm dashedB formPosition fish">
								<el-form-item label="FISH" prop="fish">
									<el-input v-model.number="saveMicmForm.fish"></el-input>
								</el-form-item>
							</el-form>
							<el-form-item class="submitBtn">
								<el-button @click="resetForm('ruleForm')">取消</el-button>
								<el-button type="primary" @click="submitOtherForm('saveMicmForm')">保存</el-button>
							</el-form-item>
						</el-tab-pane>

						<el-tab-pane label="诊断及预后" name="fourth" class="mttwo">
							<!-- 表单 诊断 -->
							<el-form :inline="true" :model="DiagnoseForm" status-icon :rules="rules" ref="DiagnoseForm" label-width="100px"
							 class="demo-ruleForm dashedB formPosition zhenduan">
								<el-form-item label="诊断" prop="diagnose">
									<el-select v-model="DiagnoseForm.diagnose" placeholder="请选择">
										<el-option v-for="item in diagnose" :key="item.id" :label="item.name" :value="item.id"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="确诊时间">
									<el-col :span="11">
										<el-date-picker type="date" placeholder="选择日期" v-model="DiagnoseForm.diagnoseTime" style="width: 100%;"></el-date-picker>
									</el-col>
								</el-form-item>
								<el-form-item label="NCCN指南" prop="nccn">
									<el-select v-model="DiagnoseForm.nccn" placeholder="请选择">
										<el-option v-for="item in nccn" :key="item.id" :label="item.name" :value="item.id"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="中国专家共识" prop="consensus">
									<el-select v-model="DiagnoseForm.consensus" placeholder="请选择">
										<el-option v-for="item in consensus" :key="item.id" :label="item.name" :value="item.id"></el-option>
									</el-select>
								</el-form-item>
							</el-form>
							<el-form-item class="submitBtn">
								<el-button @click="resetForm('ruleForm')">取消</el-button>
								<el-button type="primary" @click="submitOtherForm('DiagnoseForm')">保存</el-button>
							</el-form-item>
						</el-tab-pane>

						<el-tab-pane label="治疗" name="five" class="mttwo">
							<!-- 表单 诱导治疗 -->
							<el-form :inline="true" :model="CureForm" status-icon :rules="rules" ref="CureForm" label-width="150px" class="demo-ruleForm dashedB formPosition youdao">
								<el-form-item label="靶向治疗" prop="targeted">
									<el-select v-model="CureForm.targeted" placeholder="请选择">
										<el-option v-for="item in targeted" :key="item.id" :label="item.name" :value="item.id"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="去甲基化治疗" prop="demethy">
									<el-select v-model="CureForm.demethy" placeholder="请选择">
										<el-option v-for="item in demethy" :key="item.id" :label="item.name" :value="item.id"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="标准“3+7”" prop="standard">
									<el-select v-model="CureForm.standard" placeholder="请选择">
										<el-option v-for="item in standard" :key="item.id" :label="item.name" :value="item.id"></el-option>
									</el-select>
									<!-- <el-radio v-model="CureForm.standard" label="1" @input="changeinput($event)">是</el-radio>
									<el-radio v-model="CureForm.standard" label="2" @input="changeinput($event)">否</el-radio> -->
								</el-form-item>
								<el-form-item label="小剂量预激" prop="lowDose">
									<el-select v-model="CureForm.lowDose" placeholder="请选择">
										<el-option v-for="item in lowDose" :key="item.id" :label="item.name" :value="item.id"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="小剂量地西他滨" prop="lowDx">
									<el-input v-model.number="CureForm.lowDx"></el-input>
								</el-form-item>
								<el-form-item label="临床试验" prop="clinical">
									<el-input v-model.number="CureForm.clinical"></el-input>
								</el-form-item>
								<el-form-item label="最佳支持疗法" prop="optimal">
									<el-input v-model.number="CureForm.optimal"></el-input>
								</el-form-item>
							</el-form>

							<!-- 表单 巩固治疗 -->
							<el-form :inline="true" :model="CureForm" status-icon :rules="rules" ref="CureForm" label-width="150px" class="demo-ruleForm dashedB formPosition gonggu">
								<el-form-item label="标准治疗（疗程数）" prop="standardCure">
									<el-select v-model="CureForm.standardCure" placeholder="请选择">
										<el-option v-for="item in standardCure" :key="item.id" :label="item.name" :value="item.id"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="强化治疗（疗程数）" prop="intensifyCureValue">
									<el-select v-model="CureForm.intensifyCureValue" placeholder="请选择">
										<el-option v-for="item in intensifyCureValue" :key="item.id" :label="item.name" :value="item.id"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="是否合并靶向药物">
									<el-select v-model="CureForm.targetedIs" placeholder="请选择">
										<el-option v-for="item in targetedIs" :key="item.id" :label="item.name" :value="item.id"></el-option>
									</el-select>
								</el-form-item>
							</el-form>
							<!-- 表单 移植 -->
							<el-form :inline="true" :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm dashedB formPosition yizhi">
								<el-form-item label="方式" prop="transplantIs">
									<el-select v-model="CureForm.transplantIs" placeholder="请选择">
										<el-option v-for="item in transplantIs" :key="item.id" :label="item.name" :value="item.id"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="移植前状态" prop="transplantMed">
									<el-select v-model="CureForm.transplantMed" placeholder="请选择">
										<el-option v-for="item in transplantMed" :key="item.id" :label="item.name" :value="item.id"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="移植时间" prop="transplantTime">
									<el-col :span="11">
										<el-date-picker type="date" placeholder="选择日期" v-model="suiFangForm.transplantTime" style="width: 100%;"></el-date-picker>
									</el-col>
								</el-form-item>
							</el-form>
							<el-form-item class="submitBtn">
								<el-button @click="resetForm('ruleForm')">取消</el-button>
								<el-button type="primary" @click="submitOtherForm('CureForm')">保存</el-button>
							</el-form-item>
						</el-tab-pane>

						<el-tab-pane label="治疗相关并发症" name="six" class="mttwo">
							<!-- 表单 诊断 -->
							<el-form :model="CureCompForm" status-icon :rules="rules" ref="CureCompForm" label-width="150px" class="demo-ruleForm dashedB formPosition bingfazheng">
								<el-form-item label="感染（治疗前）" prop="infectionIs">
									<el-select v-model="CureCompForm.infectionIs" placeholder="请选择">
										<el-option v-for="item in infectionIs" :key="item.id" :label="item.name" :value="item.id"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="感染（治疗后）" prop="infectionMed">
									<el-select v-model="CureCompForm.infectionMed" placeholder="请选择">
										<el-option v-for="item in infectionMed" :key="item.id" :label="item.name" :value="item.id"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="药物性肝损害" class="morbi">
									  <span class="fuheInput">类型</span>
									  <el-select v-model="CureCompForm.medicaIs" placeholder="请选择" class="inlineShow">
									  	<el-option v-for="item in medicaIs" :key="item.id" :label="item.name" :value="item.id"></el-option>
									  </el-select>
									  <span class="fuheInput">程度</span>
									  <el-select v-model="CureCompForm.medicaValue" placeholder="请选择"  class="inlineShow">
									  	<el-option v-for="item in medicaValue" :key="item.id" :label="item.name" :value="item.id"></el-option>
									  </el-select>
								</el-form-item>
								<el-form-item label="胃肠道反应" prop="reaction">
									<el-input v-model.number="CureCompForm.reaction"></el-input>
								</el-form-item>
								<el-form-item label="骨髓抑制级别" prop="infectionMed">
									<el-select v-model="CureCompForm.tranOne" placeholder="请选择" class="inlineShow">
										<el-option v-for="item in tranOne" :key="item.id" :label="item.name" :value="item.id"></el-option>
									</el-select>
									<el-select v-model="CureCompForm.tranTwo" placeholder="请选择" class="inlineShow">
										<el-option v-for="item in tranTwo" :key="item.id" :label="item.name" :value="item.id"></el-option>
									</el-select>
									<el-select v-model="CureCompForm.TranThree	" placeholder="请选择" class="inlineShow">
										<el-option v-for="item in TranThree	" :key="item.id" :label="item.name" :value="item.id"></el-option>
									</el-select>
								</el-form-item>
							</el-form>
							<el-form-item class="submitBtn">
								<el-button @click="resetForm('ruleForm')">取消</el-button>
								<el-button type="primary" @click="submitOtherForm('CureCompForm')">保存</el-button>
							</el-form-item>
						</el-tab-pane>

						<el-tab-pane label="疗效评价" name="seven" class="mttwo">
							<!-- 表单 疗效评价 -->
							<el-form :inline="true" :model="CourseForm" status-icon :rules="rules" ref="CourseForm" label-width="150px"
							 class="demo-ruleForm dashedB formPosition liaoxiao">
								<el-form-item label="第1疗程疗效" prop="courseOne">
									<el-select v-model="CourseForm.courseOne" placeholder="请选择">
										<el-option v-for="item in courseOne" :key="item.id" :label="item.name" :value="item.id"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="达CR的疗程数" prop="courseCd">
									<el-select v-model="CourseForm.courseCd" placeholder="请选择">
										<el-option v-for="item in courseCd" :key="item.id" :label="item.name" :value="item.id"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="达CR的时间" prop="cdTime">
									<el-col :span="11">
										<el-date-picker type="date" placeholder="选择日期" v-model="CourseForm.cdTime" style="width: 100%;"></el-date-picker>
									</el-col>
								</el-form-item>
								<el-form-item label="达CR的疗程用药后4-6月血常规" prop="cdAfter">
									<el-select v-model="CourseForm.cdAfter" placeholder="请选择">
										<el-option v-for="item in cdAfter" :key="item.id" :label="item.name" :value="item.id"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="基因是否转阴">
									<el-select v-model="CourseForm.geneIs" placeholder="请选择">
										<el-option v-for="item in geneIs" :key="item.id" :label="item.name" :value="item.id"></el-option>
									</el-select>
								</el-form-item>
							</el-form>
							<el-form-item class="submitBtn">
								<el-button @click="resetForm('ruleForm')">取消</el-button>
								<el-button type="primary" @click="submitOtherForm('CourseForm')">保存</el-button>
							</el-form-item>
						</el-tab-pane>

						<el-tab-pane label="复发" name="eight" class="mttwo">
							<!-- 表单 复发 -->
							<el-form :inline="true" :model="fufaForm" status-icon :rules="rules" ref="fufaForm" label-width="150px" class="demo-ruleForm dashedB formPosition fufa">
								<el-form-item label="是否复发">
									<el-select v-model="fufaForm.recurIs" placeholder="请选择" @change="qingkong">
										<el-option v-for="item in recurIs" :key="item.id" :label="item.name" :value="item.id"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item>
									<el-select v-model="fufaForm.recurMed" placeholder="请选择"  v-if="fufaForm.recurIs==1">
										<el-option v-for="item in recurMed" :key="item.id" :label="item.name" :value="item.id"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="复发时状态" prop="recurStatus" v-if="fufaForm.recurIs==1">
									<el-select v-model="fufaForm.recurStatus" placeholder="请选择">
										<el-option v-for="item in recurStatus" :key="item.id" :label="item.name" :value="item.id"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="复发基因" prop="recurGene" v-if="fufaForm.recurIs==1">
									<el-input v-model.number="fufaForm.recurGene"></el-input>
								</el-form-item>
								<el-form-item label="复发后治疗" prop="recurDose" v-if="fufaForm.recurIs==1">
									<el-input v-model.number="fufaForm.recurDose"></el-input>
								</el-form-item>
								<el-form-item label="复发后是否再达CR" prop="recurOr" v-if="fufaForm.recurIs==1">
									<el-select v-model="fufaForm.recurOr" placeholder="请选择">
										<el-option v-for="item in yesNo" :key="item.id" :label="item.name" :value="item.id"></el-option>
									</el-select>
								</el-form-item>
							</el-form>
							<el-form-item class="submitBtn">
								<el-button @click="resetForm('ruleForm')">取消</el-button>
								<el-button type="primary" @click="submitOtherForm('fufaForm')">保存</el-button>
							</el-form-item>
						</el-tab-pane>

						<el-tab-pane label="随访" name="nine" class="mttwo">
							<!-- 表单 随访 -->
							<el-form :inline="true" :model="suiFangForm" status-icon :rules="rules" ref="suiFangForm" label-width="100px"
							 class="demo-ruleForm dashedB formPosition suifang">
								<el-form-item label="OS" prop="os">
									<el-col :span="11">
										<el-date-picker type="date" placeholder="选择日期" v-model="suiFangForm.os" style="width: 100%;"></el-date-picker>
									</el-col>
								</el-form-item>
								<el-form-item label="RFS/EFS" prop="rfsEfs">
									<el-col :span="11">
										<el-date-picker type="date" placeholder="选择日期" v-model="suiFangForm.rfsEfs" style="width: 100%;"></el-date-picker>
									</el-col>
								</el-form-item>
								<el-form-item label="结局" prop="ending">
									<el-select v-model="suiFangForm.ending" placeholder="请选择">
										<el-option v-for="item in ending" :key="item.id" :label="item.name" :value="item.id"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="随访时间" prop="suifangTime">
									<el-col :span="11">
										<el-date-picker type="date" placeholder="选择日期" v-model="suiFangForm.suifangTime" style="width: 100%;"></el-date-picker>
									</el-col>
								</el-form-item>
								<el-form-item label="随访状态" prop="suifangStatus">
									<el-select v-model="suiFangForm.suifangStatus" placeholder="请选择">
										<el-option v-for="item in suifangStatus" :key="item.id" :label="item.name" :value="item.id"></el-option>
									</el-select>
								</el-form-item>
							</el-form>
							<el-form-item class="submitBtn">
								<el-button @click="resetForm('ruleForm')">取消</el-button>
								<el-button type="primary" @click="submitOtherForm('suiFangForm')">保存</el-button>
							</el-form-item>
						</el-tab-pane>
					</el-tabs>

				</el-form>
			</el-dialog>


		</div>
	</div>
</template>

<script>
	import FileSaver from "file-saver"
	import XLSX from "xlsx"
	import axios from '@/router/axios'
	import router from '@/router/index'
	import {
		baseUrl
	} from '@/utils/baseUrl'
	export default {
		data() {
			var checkAge = (rule, value, callback) => {
				if (!value) {
					return callback(new Error('年龄不能为空'));
				}
				setTimeout(() => {
					if (!Number.isInteger(value)) {
						callback(new Error('请输入数字值'));
					} else {
						if (value < 0) {
							callback(new Error('必须年满0岁'));
						} else {
							callback();
						}
					}
				}, 1000);
			};
			var checkPhone = (rule, value, callback) => {
				if (!value) {
				  return callback(new Error('手机号不能为空'));
				} else {
				  const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
				  console.log(reg.test(value));
				  if (reg.test(value)) {
					callback();
				  } else {
					return callback(new Error('请输入正确的手机号'));
				  }
				}
			};

			return {
				activeName: 'first',
				pName: '',
				patientId: "", //患者id
				sex: [{
					"name": "男",
					"id": 1
				}, {
					"name": "女",
					"id": 0
				}],
				expotAll:true,
				mutantGene: [],
				fusionGene: [],
				bloodType: [{
					"name": "A型",
					"id": 1
				}, {
					"name": "B型",
					"id": 2
				}, {
					"name": "AB型",
					"id": 3
				}, {
					"name": "O型",
					"id": 4
				}],
				ecog: [{
					"name": "0",
					"id": 0
				}, {
					"name": "1",
					"id": 1
				}, {
					"name": "2",
					"id": 2
				}, {
					"name": "3",
					"id": 3
				}, {
					"name": "4",
					"id": 4
				}, {
					"name": "5",
					"id": 5
				}],
				degree: [{
					"name": "增生极度降低",
					"id": 1
				}, {
					"name": "增生降低",
					"id": 2
				}, {
					"name": "增生活跃",
					"id": 3
				}, {
					"name": "增生明显活跃",
					"id": 4
				}, {
					"name": "增生极度活跃",
					"id": 5
				}],
				diagnose: [{
					"name": "2016WHO诊断",
					"id": 1
				}, {
					"name": "其他",
					"id": 2
				}],
				nccn: [{
					"name": "预后不良",
					"id": 1
				}, {
					"name": "预后中等",
					"id": 2
				}, {
					"name": "预后良好",
					"id": 3
				}],
				consensus: [{
					"name": "预后不良",
					"id": 1
				}, {
					"name": "预后中等",
					"id": 2
				}, {
					"name": "预后良好",
					"id": 3
				}],
				targeted: [{
					"name": "FLT₃抑制剂",
					"id": 1
				}, {
					"name": "B₂抑制剂",
					"id": 2
				}, {
					"name": "TKI抑制剂",
					"id": 3
				}, {
					"name": "IDW₂抑制剂",
					"id": 4
				}, {
					"name": "其他",
					"id": 5
				}],
				demethy: [{
					"name": "阿扎",
					"id": 1
				}, {
					"name": "地西他滨",
					"id": 2
				}, {
					"name": "其他",
					"id": 3
				}],
				lowDose: [{
					"name": "CAG方案",
					"id": 1
				}, {
					"name": "CLG方案",
					"id": 2
				}, {
					"name": "HAG方案",
					"id": 3
				}],
				standard:[{"name": "是",
					"id": 1},{"name": "否",
					"id": 2}],
				standardCure: [{
					"name": "1",
					"id": 1
				}, {
					"name": "2",
					"id": 2
				}, {
					"name": "3",
					"id": 3
				}, {
					"name": "4",
					"id": 4
				}, {
					"name": "5",
					"id": 5
				}],
				intensifyCureValue: [{
					"name": "1",
					"id": 1
				}, {
					"name": "2",
					"id": 2
				}, {
					"name": "3",
					"id": 3
				}, {
					"name": "4",
					"id": 4
				}, {
					"name": "5",
					"id": 5
				}],
				transplantIs: [{
					"name": "CR",
					"id": 1
				}, {
					"name": "PR",
					"id": 2
				}, {
					"name": "RP",
					"id": 3
				}],
				transplantMed: [{
					"name": "MRD+",
					"id": 1
				}, {
					"name": "MRD-",
					"id": 2
				}],
				infectionIs: [{
					"name": "治疗前",
					"id": 1
				}, {
					"name": "治疗后",
					"id": 2
				}],
				infectionMed: [{
					"name": "感染部位",
					"id": 1
				}, {
					"name": "感染菌",
					"id": 2
				}, {
					"name": "感染部位",
					"id": 3
				}, {
					"name": "感染菌",
					"id": 4
				}],
				medicaIs: [{
					"name": "肝",
					"id": 1
				}, {
					"name": "胆汁淤积性",
					"id": 2
				}, {
					"name": "复合型",
					"id": 3
				}],
				medicaValue: [{
					"name": "轻微",
					"id": 1
				}, {
					"name": "中度",
					"id": 2
				}, {
					"name": "重度",
					"id": 3
				}],
				tranOne: [{
					"name": "III级",
					"id": 1
				}, {
					"name": "IV级",
					"id": 2
				}],
				tranTwo: [{
					"name": "诱导结束后III级",
					"id": 1
				}, {
					"name": "骨髓抑制时间",
					"id": 2
				}, {
					"name": "诱导结束后IV级",
					"id": 3
				}, {
					"name": "骨髓抑制时间",
					"id": 4
				}],
				TranThree: [{
					"name": "ANG",
					"id": 1
				}, {
					"name": "HG",
					"id": 2
				}, {
					"name": "PLT",
					"id": 3
				}],
				courseOne: [{
					"name": "CR",
					"id": 1
				}, {
					"name": "CP",
					"id": 2
				}, {
					"name": "PR",
					"id": 3
				}, {
					"name": "NR",
					"id": 4
				}, {
					"name": "死亡",
					"id": 5
				}],
				courseCd: [{
					"name": "1",
					"id": 1
				}, {
					"name": "2",
					"id": 2
				}, {
					"name": "3",
					"id": 3
				}, {
					"name": "4",
					"id": 4
				}, {
					"name": "5",
					"id": 5
				}],
				cdAfter: [{
					"name": "WBC（×10^9/L）",
					"id": 1
				}, {
					"name": "ANC（×10^9/L）",
					"id": 2
				}, {
					"name": "HG（×10^9/L）",
					"id": 3
				}, {
					"name": "PLT（×10^9/L）",
					"id": 4
				}],
				recurStatus: [{
					"name": "形态学",
					"id": 1
				}, {
					"name": "分子生物学",
					"id": 2
				}, {
					"name": "髓外",
					"id": 3
				}],
				yesNo: [{
					"name": "是",
					"id": 1
				}, {
					"name": "否",
					"id": 2
				}],
				morbiRed: [{
					"name": "是",
					"id": 1
				}, {
					"name": "否",
					"id": 2
				}],
				geneIs:[{
					"name": "是",
					"id": 1
				}, {
					"name": "否",
					"id": 2
				}],
				recurIs:[{
					"name": "是",
					"id": 1
				}, {
					"name": "否",
					"id": 2
				}],
				targetedIs:[{
					"name": "是",
					"id": 1
				}, {
					"name": "否",
					"id": 2
				}],
				morbiGrain: [{
					"name": "是",
					"id": 1
				}, {
					"name": "否",
					"id": 2
				}],
				morbiHuge: [{
					"name": "是",
					"id": 1
				}, {
					"name": "否",
					"id": 2
				}],
				recurMed: [{
					"name": "早期",
					"id": 1
				}, {
					"name": "晚期",
					"id": 2
				}],
				ending: [{
					"name": "有效",
					"id": 1
				}, {
					"name": "死亡",
					"id": 2
				}, {
					"name": "失访",
					"id": 3
				}],
				suifangStatus: [{
					"name": "有效",
					"id": 1
				}, {
					"name": "死亡",
					"id": 2
				}, {
					"name": "失访",
					"id": 3
				}],
				ptusername: "",
				ptelphone: '',
				tableKey: 0,
				list: null,
				total: null,
				listLoading: true,
				listQuery: {
					page: 1,
					rows: 20,
				},
				textMap: {
					create: '新建',
					update: '更改'
				},
				addForm: {
					name: "",
					sex: "",
					age: "",
					mobile: "",
					stature: "",
					weight: "",
					bloodType: "",
					ecog: "",
					lhistory: "",
					bmi: "",
					bodyArea: "",
				},
				saveExamineForm: {
					wbc: "",
					anc: "",
					hg: "",
					mcv: "",
					mch: "",
					mchc: "",
					rdwsd: "",
					rdwcv: "",
					plt: "",
					lymphn: "",
					egg: "",
					lactic: "",
					eryt: "",
					b2mg: "",
					alt: "",
					ast: "",
					tbil: "",
					direct: "",
					indirect: ""
				},
				saveMicmForm: {
					"chromosome": "",
					"degree": "",
					"fusionGene": "",
					"laip": "",
					"morbi": "",
					"morbiStatus": "",
					"mutantGene": "",
					"pbProtocell": "",
					"protocell": "",
					"protocellGs": "",
					"protocellWzx": "",
					"rest": "",
					"wti": "",
					"morbiRed":"",
					"morbiGrain":1,
					"morbiHuge":""
				},
				DiagnoseForm: {
					"consensus": "",
					"diagnose": "",
					"diagnoseTime": "",
					"nccn": "",
				},
				CureForm: {
					"standard": 1,
					"targetedIs": 1,
					"clinical": "",
					"demethy": "",
					"intensifyCureDose": "",
					"intensifyCureValue": "",
					"lowDose": "",
					"lowDx": "",
					"optimal": "",
					"standardCure": "",
					"targeted": "",
					"targetedMed": "",
					"targetedValue": "",
					"transplantIs": "",
					"transplantMed": "",
					"transplantTime": "",
					"updateTime": "",
					"wayIs": "",
					"wayMed": ""
				},
				CureCompForm: {
					"infectionIs": "",
					"infectionMed": "",
					"medicaIs": "",
					"medicaValue": "",
					"reaction": "",
					"tranOne": "",
					"tranThree": "",
					"tranTwo": "",
				},
				CourseForm: {
					"geneIs": 1,
					"cdAfter":"",
					"cdTime":"",
					"courseCd":"",
					"courseOne":"",
				},
				fufaForm: {
					"recurIs": 2,
					"recurDose": "",
					"recurGene": "",
					"recurMed": "",
					"recurOr": "",
					"recurStatus": ""
				},
				suiFangForm: {
					"ending": "",
					"id": "",
					"os": "",
					"rfsEfs": "",
					"suifangStatus": "",
					"suifangTime": "",
				},
				ruleForm: {
					pass: '',
					checkPass: '',
					age: '',
				},
				rules: {
					age: [{
						validator: checkAge,
						required: true, 
						message: '请输入年龄',
						trigger: 'blur'
					}],
					mobile: [{
						validator: checkPhone, 
						trigger: 'blur',
						required: true,
						message: '请输入手机号'
					}],
					name: [
						{ required: true, message: '请输入患者姓名', trigger: 'blur' },
						{ min: 2, max:8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
					],
					lhistory:[{required: true,message: '请输入既往史', trigger: 'blur'}],
					stature:[{required: true,message: '请输入身高', trigger: 'blur'}],
					sex:[{required: true,message: '请选择性别', trigger: 'blur'}],
					bloodType:[{required: true,message: '请选择血型', trigger: 'blur'}],
					weight:[{required: true,message: '请输入体重', trigger: 'blur'}],
					ecog:[{required: true,message: '请选择ECOG评分', trigger: 'blur'}],
				},
				form: {
					isRecommend: '0'
				},
				dialogFormVisible: false,
				dialogStatus: '',
				heads: {},
			}
		},
		created() {
			var userName = sessionStorage.getItem("userName")
			if (userName == null) {
				router.push({
					path: '/login'
				});
			}
			var that = this
			for (var i = 1; i < 44; i++) {
				var jiyinlist = {}
				jiyinlist.name = i;
				jiyinlist.id = i;
				that.mutantGene.push(jiyinlist)
				that.fusionGene.push(jiyinlist)
			}
			this.getList();
		},
		methods: {
			widthCheck(){
				if(this.ptusername.length==0){
					
				}
			},
			getList() { /*** 获取患者列表*/
				this.listLoading = true
				for (let key in this.listQuery) {
					if (this.listQuery[key] == '') {
						delete this.listQuery[key]
					}
				}
				axios.post(baseUrl() + 'user/patientList', this.listQuery).then(res => {
					if (res.data.code === 200) {
						this.list = res.data.data.records
						this.listLoading = false;
						this.total = res.data.data.total
					} else {
						this.$message({
							message: res.data.message,
							type: 'warning'
						});
					}
				}).catch(err => {
					this.$message({
						message: '错误',
						type: 'warning'
					});
				})
			},
			handleUpdate(id) { /*** 查看用户详情按钮*/
				this.dialogStatus = "update";
				this.dialogFormVisible = true;
				this.activeName = 'first',
					this.patientId = id;
				this.getPatientInfo(id)
			},
			getPatientInfo(id) { //查看详情，修改患者信息
				// 查询患者基本信息
				axios.get(baseUrl() + 'user/patientDetails', {
					params: {
						'id': id
					}
				}).then(res => {
					if (res.data.code === 200) {
						this.addForm.name = res.data.data.name;
						this.addForm.sex = res.data.data.sex;
						this.addForm.age = res.data.data.age;
						this.addForm.mobile = res.data.data.mobile;
						this.addForm.stature = res.data.data.stature;
						this.addForm.weight = res.data.data.weight;
						this.addForm.bloodType = res.data.data.bloodType;
						this.addForm.ecog = res.data.data.ecog;
						this.addForm.lhistory = res.data.data.lhistory;
						this.addForm.bmi = res.data.data.bmi;
						this.addForm.bodyArea = res.data.data.bodyArea;
					} else {
						this.$message({
							message: res.data.message,
							type: 'warning'
						});
					}
				}).catch(err => {
					this.$message({
						message: '错误',
						type: 'warning'
					});
				});
			},
			handleClick(tab, event) { //选项卡切换事件
				if (this.dialogStatus == "create") { //新增的时候不调取查询接口

				} else {
					switch (this.activeName) {
						case "second":
							// 查询实验室检查
							axios.get(baseUrl() + 'user/examineDetails', {
								params: {
									'id': this.patientId
								}
							}).then(res => {
								if (res.data.code === 200) {
									this.saveExamineForm.wbc = res.data.data.wbc;
									this.saveExamineForm.anc = res.data.data.anc;
									this.saveExamineForm.hg = res.data.data.hg;
									this.saveExamineForm.mcv = res.data.data.mcv;
									this.saveExamineForm.mch = res.data.data.mch;
									this.saveExamineForm.mchc = res.data.data.mchc;
									this.saveExamineForm.rdwsd = res.data.data.rdwsd;
									this.saveExamineForm.rdwcv = res.data.data.rdwcv;
									this.saveExamineForm.plt = res.data.data.plt;
									this.saveExamineForm.lymphn = res.data.data.lymphn;
									this.saveExamineForm.egg = res.data.data.egg;
									this.saveExamineForm.lactic = res.data.data.lactic;
									this.saveExamineForm.eryt = res.data.data.eryt;
									this.saveExamineForm.b2mg = res.data.data.b2mg;
									this.saveExamineForm.alt = res.data.data.alt;
									this.saveExamineForm.ast = res.data.data.ast;
									this.saveExamineForm.tbil = res.data.data.tbil;
									this.saveExamineForm.direct = res.data.data.direct;
									this.saveExamineForm.indirect = res.data.data.indirect;
								} else {
									this.$message({
										message: res.data.message,
										type: 'warning'
									});
								}
							}).catch(err => {
								// this.$message({
								//   message: '没有数据',
								//   type: 'warning'
								// });

								//实验室
								this.saveExamineForm.wbc = "";
								this.saveExamineForm.anc = "";
								this.saveExamineForm.hg = "";
								this.saveExamineForm.mcv = "";
								this.saveExamineForm.mch = "";
								this.saveExamineForm.mchc = "";
								this.saveExamineForm.rdwsd = "";
								this.saveExamineForm.rdwcv = "";
								this.saveExamineForm.plt = "";
								this.saveExamineForm.lymphn = "";
								this.saveExamineForm.egg = "";
								this.saveExamineForm.lactic = "";
								this.saveExamineForm.eryt = "";
								this.saveExamineForm.b2mg = "";
								this.saveExamineForm.alt = "";
								this.saveExamineForm.ast = "";
								this.saveExamineForm.tbil = "";
								this.saveExamineForm.direct = "";
								this.saveExamineForm.indirect = "";

							});
							break;
						case "third":
							// 查询MICM详情
							axios.get(baseUrl() + 'user/getMicm', {
								params: {
									'id': this.patientId
								}
							}).then(res => {
								if (res.data.code === 200) {
									this.saveMicmForm.chromosome = res.data.data.chromosome;
									this.saveMicmForm.createTime = res.data.data.createTime;
									this.saveMicmForm.degree = res.data.data.degree;
									this.saveMicmForm.fusionGene = res.data.data.fusionGene;
									this.saveMicmForm.laip = res.data.data.laip;
									this.saveMicmForm.morbi = res.data.data.morbi;
									this.saveMicmForm.morbiStatus = res.data.data.morbiStatus;
									this.saveMicmForm.mutantGene = res.data.data.mutantGene;
									this.saveMicmForm.patientId = res.data.data.patientId;
									this.saveMicmForm.pbProtocell = res.data.data.pbProtocell;
									this.saveMicmForm.protocell = res.data.data.protocell;
									this.saveMicmForm.protocellGs = res.data.data.protocellGs;
									this.saveMicmForm.protocellWzx = res.data.data.protocellWzx;
									this.saveMicmForm.rest = res.data.data.rest;
									this.saveMicmForm.updateTime = res.data.data.updateTime;
									this.saveMicmForm.wti = res.data.data.wti;
									this.saveMicmForm.morbiRed = res.data.data.morbiRed;
									this.saveMicmForm.morbiGrain = res.data.data.morbiGrain;
									this.saveMicmForm.morbiHuge = res.data.data.morbiHuge;
								} else {
									this.$message({
										message: res.data.message,
										type: 'warning'
									});
								}
							}).catch(err => {
								// this.$message({
								//   message: '没有数据',
								//   type: 'warning'
								// });
								//MIC
								this.saveMicmForm.chromosome = "";
								this.saveMicmForm.createTime = "";
								this.saveMicmForm.degree = "";
								this.saveMicmForm.fusionGene = "";
								this.saveMicmForm.laip = "";
								this.saveMicmForm.morbi = "";
								this.saveMicmForm.morbiStatus = "";
								this.saveMicmForm.mutantGene = "";
								this.saveMicmForm.patientId = "";
								this.saveMicmForm.pbProtocell = "";
								this.saveMicmForm.protocell = "";
								this.saveMicmForm.protocellGs = "";
								this.saveMicmForm.protocellWzx = "";
								this.saveMicmForm.rest = "";
								this.saveMicmForm.updateTime = "";
								this.saveMicmForm.wti = "";
								this.saveMicmForm.morbiRed = "";
								this.saveMicmForm.morbiGrain = "";
								this.saveMicmForm.morbiHuge = "";
							});
							break;
						case "fourth":
							// 查询诊断及治愈后
							axios.get(baseUrl() + 'user/getDiagnose', {
								params: {
									'id': this.patientId
								}
							}).then(res => {
								if (res.data.code === 200) {
									this.DiagnoseForm.consensus = res.data.data.consensus;
									this.DiagnoseForm.diagnose = res.data.data.diagnose;
									this.DiagnoseForm.diagnoseTime = res.data.data.diagnoseTime;
									this.DiagnoseForm.nccn = res.data.data.nccn;

								} else {
									this.$message({
										message: res.data.message,
										type: 'warning'
									});
								}
							}).catch(err => {
								// this.$message({
								//   message: '没有数据',
								//   type: 'warning'
								// });
								//诊断
								this.DiagnoseForm.consensus = "";
								this.DiagnoseForm.diagnose = "";
								this.DiagnoseForm.diagnoseTime = "";
								this.DiagnoseForm.nccn = "";
							});
							break;
						case "five":
							// 查询治疗详情
							axios.get(baseUrl() + 'user/getCure', {
								params: {
									'id': this.patientId
								}
							}).then(res => {
								if (res.data.code === 200) {
									this.CureForm.standard = res.data.data.standard;
									this.CureForm.targetedIs = res.data.data.targetedIs;
									this.CureForm.clinical = res.data.data.clinical;
									this.CureForm.demethy = res.data.data.demethy;
									this.CureForm.intensifyCureDose = res.data.data.intensifyCureDose;
									this.CureForm.intensifyCureValue = res.data.data.intensifyCureValue;
									this.CureForm.lowDose = res.data.data.lowDose;
									this.CureForm.lowDx = res.data.data.lowDx;
									this.CureForm.optimal = res.data.data.optimal;
									this.CureForm.standard = res.data.data.standard;
									this.CureForm.standardCure = res.data.data.standardCure;
									this.CureForm.targeted = res.data.data.targeted;
									this.CureForm.targetedMed = res.data.data.targetedMed;
									this.CureForm.targetedValue = res.data.data.targetedValue;
									this.CureForm.transplantIs = res.data.data.transplantIs;
									this.CureForm.transplantMed = res.data.data.transplantMed;
									this.CureForm.transplantTime = res.data.data.transplantTime;
									this.CureForm.wayIs = res.data.data.wayIs;
									this.CureForm.wayMed = res.data.data.wayMed;
								} else {
									this.$message({
										message: res.data.message,
										type: 'warning'
									});

								}
							}).catch(err => {
								// this.$message({
								//   message: '没有数据',
								//   type: 'warning'
								// });
								//治疗
								this.CureForm.standard = "";
								this.CureForm.targetedIs = "";
								this.CureForm.clinical = "";
								this.CureForm.demethy = "";
								this.CureForm.intensifyCureDose = "";
								this.CureForm.intensifyCureValue = "";
								this.CureForm.lowDose = "";
								this.CureForm.lowDx = "";
								this.CureForm.optimal = "";
								this.CureForm.standard = "";
								this.CureForm.standardCure = "";
								this.CureForm.targeted = "";
								this.CureForm.targetedMed = "";
								this.CureForm.targetedValue = "";
								this.CureForm.transplantIs = "";
								this.CureForm.transplantMed = "";
								this.CureForm.transplantTime = "";
								this.CureForm.wayIs = "";
								this.CureForm.wayMed = "";
							});
							break;
						case "six":
							// 查询治疗并发症
							axios.get(baseUrl() + 'user/getCureComp', {
								params: {
									'id': this.patientId
								}
							}).then(res => {
								if (res.data.code === 200) {
									this.CureCompForm.infectionIs = res.data.data.infectionIs;
									this.CureCompForm.infectionMed = res.data.data.infectionMed;
									this.CureCompForm.medicaIs = res.data.data.medicaIs;
									this.CureCompForm.medicaValue = res.data.data.medicaValue;
									this.CureCompForm.reaction = res.data.data.reaction;
									this.CureCompForm.tranOne = res.data.data.tranOne;
									this.CureCompForm.tranThree = res.data.data.tranThree;
									this.CureCompForm.tranTwo = res.data.data.tranTwo;
								} else {
									this.$message({
										message: res.data.message,
										type: 'warning'
									});
								}
							}).catch(err => {
								// this.$message({
								//   message: '没有数据',
								//   type: 'warning'
								// });
								//并发症
								this.CureCompForm.infectionIs = "";
								this.CureCompForm.infectionMed = "";
								this.CureCompForm.medicaIs = "";
								this.CureCompForm.medicaValue = "";
								this.CureCompForm.reaction = "";
								this.CureCompForm.tranOne = "";
								this.CureCompForm.tranThree = "";
								this.CureCompForm.tranTwo = "";
							});
							break;
						case "seven":
							// 查询疗效评价详情
							axios.get(baseUrl() + 'user/getCourse', {
								params: {
									'id': this.patientId
								}
							}).then(res => {
								if (res.data.code === 200) {
									this.CourseForm.geneIs = res.data.data.geneIs;
									this.CourseForm.courseOne = res.data.data.courseOne;
									this.CourseForm.courseCd = res.data.data.courseCd;
									this.CourseForm.cdTime = res.data.data.cdTime;
									this.CourseForm.cdAfter = res.data.data.cdAfter;
								} else {
									this.$message({
										message: res.data.message,
										type: 'warning'
									});
								}
							}).catch(err => {
								// this.$message({
								//   message: '没有数据',
								//   type: 'warning'
								// });
								this.CourseForm.geneIs = "";
								this.CourseForm.courseOne = "";
								this.CourseForm.courseCd = "";
								this.CourseForm.cdTime = "";
								this.CourseForm.cdAfter = "";
							});
							break;
						case "eight":
							// 查询复发详情
							axios.get(baseUrl() + 'user/getReappera', {
								params: {
									'id': this.patientId
								}
							}).then(res => {
								if (res.data.code === 200) {
									this.fufaForm.recurIs = res.data.data.recurIs;
									this.fufaForm.recurDose = res.data.data.recurDose;
									this.fufaForm.recurGene = res.data.data.recurGene;
									this.fufaForm.recurMed = res.data.data.recurMed;
									this.fufaForm.recurOr = res.data.data.recurOr;
									this.fufaForm.recurStatus = res.data.data.recurStatus;
								} else {
									this.$message({
										message: res.data.message,
										type: 'warning'
									});
								}
							}).catch(err => {
								// this.$message({
								//   message: '没有数据',
								//   type: 'warning'
								// });

								//8
								this.fufaForm.recurIs = 2;
								this.fufaForm.recurDose = "";
								this.fufaForm.recurGene = "";
								this.fufaForm.recurMed = "";
								this.fufaForm.recurOr = "";
								this.fufaForm.recurStatus = "";
							});
							break;
						case "nine":
							// 查询随访详情
							axios.get(baseUrl() + 'user/getSuifang', {
								params: {
									'id': this.patientId
								}
							}).then(res => {
								if (res.data.code === 200) {
									this.suiFangForm.ending = res.data.data.ending;
									this.suiFangForm.os = res.data.data.os;
									this.suiFangForm.rfsEfs = res.data.data.rfsEfs;
									this.suiFangForm.suifangStatus = res.data.data.suifangStatus;
									this.suiFangForm.suifangTime = res.data.data.suifangTime;
								} else {
									this.$message({
										message: res.data.message,
										type: 'warning'
									});
								}
							}).catch(err => {
								// this.$message({
								//   message: '没有数据',
								//   type: 'warning'
								// });
								//随访
								this.suiFangForm.ending = "";
								this.suiFangForm.os = "";
								this.suiFangForm.rfsEfs = "";
								this.suiFangForm.suifangStatus = "";
								this.suiFangForm.suifangTime = "";
							});
							break;
					}

				}

			},
			submitForm(formName) { //新增患者信息提交
				this.$refs[formName].validate((valid) => {
					if (valid) {
						axios.post(baseUrl() + 'user/savePatient', this.addForm).then(res => {
							if (res.data.code === 200) {
								this.patientId = res.data.data.id;
								this.$notify({
									title: "成功",
									message: "保存成功",
									type: "success",
									duration: 2000
								});
								this.getList();
							} else {
								this.$message({
									message: res.data.message,
									type: 'warning'
								});
							}
						}).catch(err => {
							this.$message({
								message: '错误',
								type: 'warning'
							});
						})
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			submitUpdateForm(formName){
				this.addForm.id=this.patientId
				this.$refs[formName].validate((valid) => {
					if (valid) {
						axios.post(baseUrl() + 'user/savePatient', this.addForm).then(res => {
							if (res.data.code === 200) {
								this.$notify({
									title: "成功",
									message: "保持成功",
									type: "success",
									duration: 2000
								});
								this.getList();
							} else {
								this.$message({
									message: res.data.message,
									type: 'warning'
								});
							}
						}).catch(err => {
							this.$message({
								message: '错误',
								type: 'warning'
							});
						})
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			submitOtherForm(con) { //提交其他信息
				if (this.patientId == "") {
					this.$notify({
						title: "失败",
						message: "请填写患者信息",
						type: "warning",
						duration: 2000
					});
					return false;
				} else {
					this.saveExamineForm.patientId = this.patientId;
					this.saveMicmForm.patientId = this.patientId;
					this.DiagnoseForm.patientId = this.patientId;
					this.CureForm.patientId = this.patientId;
					this.CureCompForm.patientId = this.patientId;
					this.CourseForm.patientId = this.patientId;
					this.fufaForm.patientId = this.patientId;
					this.suiFangForm.patientId = this.patientId;
					switch (con) {
						case "saveExamineForm":
							axios.post(baseUrl() + 'user/saveExamine', this.saveExamineForm).then(res => {
								if (res.data.code === 200) {
									this.$notify({
										title: "成功",
										message: "保存成功",
										type: "success",
										duration: 2000
									});
								} else {
									this.$message({
										message: res.data.message,
										type: 'warning'
									});
								}
							}).catch(err => {
								this.$message({
									message: '错误',
									type: 'warning'
								});
							});
							break;
						case "saveMicmForm":
							axios.post(baseUrl() + 'user/saveMicm', this.saveMicmForm).then(res => {
								if (res.data.code === 200) {
									this.$notify({
										title: "成功",
										message: "保存成功",
										type: "success",
										duration: 2000
									});
								} else {
									this.$message({
										message: res.data.message,
										type: 'warning'
									});
								}
							}).catch(err => {
								this.$message({
									message: '错误',
									type: 'warning'
								});
							});
							break;
						case "DiagnoseForm":
							axios.post(baseUrl() + 'user/saveDiagnose', this.DiagnoseForm).then(res => {
								if (res.data.code === 200) {
									this.$notify({
										title: "成功",
										message: "保存成功",
										type: "success",
										duration: 2000
									});
								} else {
									this.$message({
										message: res.data.message,
										type: 'warning'
									});
								}
							}).catch(err => {
								this.$message({
									message: '错误',
									type: 'warning'
								});
							});
							break;
						case "CureForm":
							axios.post(baseUrl() + 'user/saveCure', this.CureForm).then(res => {
								if (res.data.code === 200) {
									this.$notify({
										title: "成功",
										message: "保存成功",
										type: "success",
										duration: 2000
									});
								} else {
									this.$message({
										message: res.data.message,
										type: 'warning'
									});
								}
							}).catch(err => {
								this.$message({
									message: '错误',
									type: 'warning'
								});
							});
							break;
						case "CureCompForm":
							axios.post(baseUrl() + 'user/saveCureComp', this.CureCompForm).then(res => {
								if (res.data.code === 200) {
									this.$notify({
										title: "成功",
										message: "保存成功",
										type: "success",
										duration: 2000
									});
								} else {
									this.$message({
										message: res.data.message,
										type: 'warning'
									});
								}
							}).catch(err => {
								this.$message({
									message: '错误',
									type: 'warning'
								});
							});
							break;
						case "CourseForm":
							console.log(this.CourseForm)
							axios.post(baseUrl() + 'user/saveCourse', this.CourseForm).then(res => {
								if (res.data.code === 200) {
									this.$notify({
										title: "成功",
										message: "保存成功",
										type: "success",
										duration: 2000
									});
								} else {
									this.$message({
										message: res.data.message,
										type: 'warning'
									});
								}
							}).catch(err => {
								this.$message({
									message: '错误',
									type: 'warning'
								});
							});
							break;
						case "fufaForm":
							axios.post(baseUrl() + 'user/saveReappera', this.fufaForm).then(res => {
								if (res.data.code === 200) {
									this.$notify({
										title: "成功",
										message: "保存成功",
										type: "success",
										duration: 2000
									});
								} else {
									this.$message({
										message: res.data.message,
										type: 'warning'
									});
								}
							}).catch(err => {
								this.$message({
									message: '错误',
									type: 'warning'
								});
							});
							break;
						case "suiFangForm":
							axios.post(baseUrl() + 'user/saveSuifang', this.suiFangForm).then(res => {
								if (res.data.code === 200) {
									this.$notify({
										title: "成功",
										message: "保存成功",
										type: "success",
										duration: 2000
									});
								} else {
									this.$message({
										message: res.data.message,
										type: 'warning'
									});
								}
							}).catch(err => {
								this.$message({
									message: '错误',
									type: 'warning'
								});
							});
							break;
					}
				}
			},
			exportExcel() { // 导出表格所用
				this.listQuery.rows = this.total;//表格长度变长
				this.getList()
				var that=this;
				this.$message({
					message: "正在导出，请稍等",
					type: 'warning'
				});
				setTimeout(function(){
					let time = new Date();
					let year = time.getFullYear();
					let month = time.getMonth() + 1;
					let day = time.getDate();
					let name = year + "" + month + "" + day;
					var wb = XLSX.utils.table_to_book(document.querySelector(".table"));
					var wbout = XLSX.write(wb, {
						bookType: "xlsx",
						bookSST: true,
						type: "array"
					});
					that.listQuery.rows = 20;//表格长度变长
					that.getList()
					try {
						FileSaver.saveAs(
							new Blob([wbout], {
								type: "application/octet-stream"
							}),
							name + ".xlsx"
						);
					} catch (e) {
						if (typeof console !== "undefined") console.log(e, wbout);
					}
					return wbout;
				},2000)
			},
			handleCreate() { //新增患者
				this.dialogStatus = "create";
				this.dialogFormVisible = true;
				this.activeName = 'first';
				this.patientId = "";

				//用户信息
				this.addForm.name = "";
				this.addForm.sex = "";
				this.addForm.age = "";
				this.addForm.mobile = "";
				this.addForm.stature = "";
				this.addForm.weight = "";
				this.addForm.bloodType = "";
				this.addForm.ecog = "";
				this.addForm.lhistory = "";
				this.addForm.bmi = "";
				this.addForm.bodyArea = "";

				//实验室
				this.saveExamineForm.wbc = "";
				this.saveExamineForm.anc = "";
				this.saveExamineForm.hg = "";
				this.saveExamineForm.mcv = "";
				this.saveExamineForm.mch = "";
				this.saveExamineForm.mchc = "";
				this.saveExamineForm.rdwsd = "";
				this.saveExamineForm.rdwcv = "";
				this.saveExamineForm.plt = "";
				this.saveExamineForm.lymphn = "";
				this.saveExamineForm.egg = "";
				this.saveExamineForm.lactic = "";
				this.saveExamineForm.eryt = "";
				this.saveExamineForm.b2mg = "";
				this.saveExamineForm.alt = "";
				this.saveExamineForm.ast = "";
				this.saveExamineForm.tbil = "";
				this.saveExamineForm.direct = "";
				this.saveExamineForm.indirect = "";

				//MIC
				this.saveMicmForm.chromosome = "";
				this.saveMicmForm.createTime = "";
				this.saveMicmForm.degree = "";
				this.saveMicmForm.fusionGene = "";
				this.saveMicmForm.laip = "";
				this.saveMicmForm.morbi = "";
				this.saveMicmForm.morbiStatus = "";
				this.saveMicmForm.mutantGene = "";
				this.saveMicmForm.patientId = "";
				this.saveMicmForm.pbProtocell = "";
				this.saveMicmForm.protocell = "";
				this.saveMicmForm.protocellGs = "";
				this.saveMicmForm.protocellWzx = "";
				this.saveMicmForm.rest = "";
				this.saveMicmForm.updateTime = "";
				this.saveMicmForm.wti = "";
				this.saveMicmForm.morbiRed = "";
				this.saveMicmForm.morbiGrain = "";
				this.saveMicmForm.morbiHuge = "";

				//诊断
				this.DiagnoseForm.consensus = "";
				this.DiagnoseForm.diagnose = "";
				this.DiagnoseForm.diagnoseTime = "";
				this.DiagnoseForm.nccn = "";


				//治疗
				this.CureForm.standard = "";
				this.CureForm.targetedIs = "";
				this.CureForm.clinical = "";
				this.CureForm.demethy = "";
				this.CureForm.intensifyCureDose = "";
				this.CureForm.intensifyCureValue = "";
				this.CureForm.lowDose = "";
				this.CureForm.lowDx = "";
				this.CureForm.optimal = "";
				this.CureForm.standard = "";
				this.CureForm.standardCure = "";
				this.CureForm.targeted = "";
				this.CureForm.targetedMed = "";
				this.CureForm.targetedValue = "";
				this.CureForm.transplantIs = "";
				this.CureForm.transplantMed = "";
				this.CureForm.transplantTime = "";
				this.CureForm.wayIs = "";
				this.CureForm.wayMed = "";

				//并发症
				this.CureCompForm.infectionIs = "";
				this.CureCompForm.infectionMed = "";
				this.CureCompForm.medicaIs = "";
				this.CureCompForm.medicaValue = "";
				this.CureCompForm.reaction = "";
				this.CureCompForm.tranOne = "";
				this.CureCompForm.tranThree = "";
				this.CureCompForm.tranTwo = "";

				//7空着 todo
				this.CourseForm.geneIs = "";
				this.CourseForm.courseOne = "";
				this.CourseForm.courseCd = "";
				this.CourseForm.cdTime = "";
				this.CourseForm.cdAfter = "";

				//8
				this.fufaForm.recurIs = 2;
				this.fufaForm.recurDose = "";
				this.fufaForm.recurGene = "";
				this.fufaForm.recurMed = "";
				this.fufaForm.recurOr = "";
				this.fufaForm.recurStatus = "";

				//随访
				this.suiFangForm.ending = "";
				this.suiFangForm.os = "";
				this.suiFangForm.rfsEfs = "";
				this.suiFangForm.suifangStatus = "";
				this.suiFangForm.suifangTime = "";

			},
			handleSizeChange(val) { /*** 每页数量改变*/
				this.listQuery.rows = val
				this.getList()
			},
			handleCurrentChange(val) { /*** 页码改变*/
				this.listQuery.page = val
				this.getList()
			},
			handleFilter(name, phone) { /*** 搜索*/
				this.listQuery.page = 1;
				this.listQuery.name = name;
				this.listQuery.mobile = phone;
				
				if(this.ptusername.length==0 && this.ptelphone.length==0){
					this.$message({
					  message: '请输入查询条件',
					  type: 'warning'
					});
					this.getList();
					this.expotAll=true;
					return false;
				}else{
					this.getList();
					this.expotAll=false;
				}
				
			},
			changeinput(e) { //数据不能修改的解决
				this.$forceUpdate()
			},
			calcbmi(){//计算BMI
				var height = Number(this.addForm.stature) / 100;
				var bmi = this.addForm.weight / (height * height);
				this.addForm.bmi = bmi.toString().substr(0, 4);
			},
			calcbodyArea(){ //计算体表面积
				var obj1 = this.addForm.stature;//身高
				var obj2 = this.addForm.weight;//体重
				var num1 = parseFloat(obj1);
				var num2 = parseFloat(obj2);
				var num = 0;
				num = 0.0061 * num1 + 0.0124 * num2 - 0.0099; //不区分男女通用计算
				this.addForm.bodyArea = num.toString().substr(0, 4);
			},
			stature() {
				if (this.addForm.stature != "" && this.addForm.weight !="") {
					this.calcbmi();
					this.calcbodyArea()
				}
			},
			weight() {
				if (this.addForm.stature != "" && this.addForm.weight !="") {
					this.calcbmi();
					this.calcbodyArea()
				}
			},
			resetForm(formName) { /*** 点击取消按钮*/
				this.dialogFormVisible = false;
			},
			closeDialog(){ //关闭弹窗
			  this.activeName = 'first';
			  this.patientId = "";
			  
			  //用户信息
			  this.addForm.name = "";
			  this.addForm.sex = "";
			  this.addForm.age = "";
			  this.addForm.mobile = "";
			  this.addForm.stature = "";
			  this.addForm.weight = "";
			  this.addForm.bloodType = "";
			  this.addForm.ecog = "";
			  this.addForm.lhistory = "";
			  this.addForm.bmi = "";
			  this.addForm.bodyArea = "";
			  
			  //实验室
			  this.saveExamineForm.wbc = "";
			  this.saveExamineForm.anc = "";
			  this.saveExamineForm.hg = "";
			  this.saveExamineForm.mcv = "";
			  this.saveExamineForm.mch = "";
			  this.saveExamineForm.mchc = "";
			  this.saveExamineForm.rdwsd = "";
			  this.saveExamineForm.rdwcv = "";
			  this.saveExamineForm.plt = "";
			  this.saveExamineForm.lymphn = "";
			  this.saveExamineForm.egg = "";
			  this.saveExamineForm.lactic = "";
			  this.saveExamineForm.eryt = "";
			  this.saveExamineForm.b2mg = "";
			  this.saveExamineForm.alt = "";
			  this.saveExamineForm.ast = "";
			  this.saveExamineForm.tbil = "";
			  this.saveExamineForm.direct = "";
			  this.saveExamineForm.indirect = "";
			  
			  //MIC
			  this.saveMicmForm.chromosome = "";
			  this.saveMicmForm.createTime = "";
			  this.saveMicmForm.degree = "";
			  this.saveMicmForm.fusionGene = "";
			  this.saveMicmForm.laip = "";
			  this.saveMicmForm.morbi = "";
			  this.saveMicmForm.morbiStatus = "";
			  this.saveMicmForm.mutantGene = "";
			  this.saveMicmForm.patientId = "";
			  this.saveMicmForm.pbProtocell = "";
			  this.saveMicmForm.protocell = "";
			  this.saveMicmForm.protocellGs = "";
			  this.saveMicmForm.protocellWzx = "";
			  this.saveMicmForm.rest = "";
			  this.saveMicmForm.updateTime = "";
			  this.saveMicmForm.wti = "";
			  this.saveMicmForm.morbiRed = "";
			  this.saveMicmForm.morbiGrain = "";
			  this.saveMicmForm.morbiHuge = "";
			  
			  //诊断
			  this.DiagnoseForm.consensus = "";
			  this.DiagnoseForm.diagnose = "";
			  this.DiagnoseForm.diagnoseTime = "";
			  this.DiagnoseForm.nccn = "";
			  
			  
			  //治疗
			  this.CureForm.standard = "";
			  this.CureForm.targetedIs = "";
			  this.CureForm.clinical = "";
			  this.CureForm.demethy = "";
			  this.CureForm.intensifyCureDose = "";
			  this.CureForm.intensifyCureValue = "";
			  this.CureForm.lowDose = "";
			  this.CureForm.lowDx = "";
			  this.CureForm.optimal = "";
			  this.CureForm.standard = "";
			  this.CureForm.standardCure = "";
			  this.CureForm.targeted = "";
			  this.CureForm.targetedMed = "";
			  this.CureForm.targetedValue = "";
			  this.CureForm.transplantIs = "";
			  this.CureForm.transplantMed = "";
			  this.CureForm.transplantTime = "";
			  this.CureForm.wayIs = "";
			  this.CureForm.wayMed = "";
			  
			  //并发症
			  this.CureCompForm.infectionIs = "";
			  this.CureCompForm.infectionMed = "";
			  this.CureCompForm.medicaIs = "";
			  this.CureCompForm.medicaValue = "";
			  this.CureCompForm.reaction = "";
			  this.CureCompForm.tranOne = "";
			  this.CureCompForm.tranThree = "";
			  this.CureCompForm.tranTwo = "";
			  
			  //7空着 todo
			  this.CourseForm.geneIs = "";
			  this.CourseForm.courseOne = "";
			  this.CourseForm.courseCd = "";
			  this.CourseForm.cdTime = "";
			  this.CourseForm.cdAfter = "";
			  //8
			  this.fufaForm.recurIs = 2;
			  this.fufaForm.recurDose = "";
			  this.fufaForm.recurGene = "";
			  this.fufaForm.recurMed = "";
			  this.fufaForm.recurOr = "";
			  this.fufaForm.recurStatus = "";
			  
			  //随访
			  this.suiFangForm.ending = "";
			  this.suiFangForm.os = "";
			  this.suiFangForm.rfsEfs = "";
			  this.suiFangForm.suifangStatus = "";
			  this.suiFangForm.suifangTime = "";
			},
			qingkong(){//清空所选的值
				if(this.fufaForm.recurIs == 2){
					this.fufaForm.recurDose = "";
					this.fufaForm.recurGene = "";
					this.fufaForm.recurMed = "";
					this.fufaForm.recurOr = "";
					this.fufaForm.recurStatus = "";
				}
			},
		}
	}
</script>
<style scoped="scoped">
	.inputWidth {
		width: 200px;
	}

	.dashedB {
		width: 850px;
		text-align: left;
		border: 1px dashed #ccc;
		padding-top: 20px;
		margin: 0 auto;
	}

	.mttwo {
		margin-top: 20px;
	}

	.formPosition {
		position: relative;
		margin: 20px auto;
	}

	.formPosition:before {
		position: absolute;
		display: block;
		min-width: 60px;
		height: 30px;
		background: #fff;
		left: 30px;
		top: -10px;
	}

	.userInfo:before {
		content: "新增患者";
	}

	.xuechang::before {
		content: "血常规(生病时)";
	}

	.xuechang {
		padding: 20px;
		box-sizing: border-box;
	}

	.shenghua::before {
		content: "生化";
	}

	.gusui::before {
		content: "发病时骨髓形态";
	}

	.mianyi::before {
		content: "免疫分型";
	}

	.jiyin::before {
		content: "基因";
	}

	.ranseti::before {
		content: "染色体";
	}

	.fish::before {
		content: "FISH";
	}

	.zhenduan::before {
		content: "诊断";
	}

	.youdao::before {
		content: "诱导治疗";
	}

	.gonggu::before {
		content: "巩固治疗";
	}

	.yizhi::before {
		content: "是否移植（类型）";
	}

	.bingfazheng::before {
		content: "治疗相关并发症";
	}

	.liaoxiao::before {
		content: "疗效评价";
	}

	.fufa::before {
		content: "复发";
	}

	.suifang::before {
		content: "随访";
	}
		/* 导出按钮 */
		.toexcel {
			cursor: pointer;
			cursor: hand;
			width: 70px;
			height: 34px;
		}
	
		.fl {
			float: left;
		}
	
		.fr {
			float: right;
		}
	
		.clearfix {
			clear: both;
		}
	
		.mtltwo {
			margin-left: 20px;
		}
	
		.patwo {
			margin-bottom: 10px;
		}
	
		hr {
			background-color: #ebeef5;
			height: 1px;
			border: none;
		}
	
	
		.gusui .el-form-item {
			width: 800px;
		}
	
		.bingfazheng .el-form-item {
			width: 800px;
		}
		
		.submitBtn{
			width:900px;
			text-align: center;
		}
		.fuheInput{
			display: inline-block;
			height: 39px;
			background-color: #f5f7fa;
			color: #909399;
			vertical-align: middle;
			line-height: 39px;
			padding: 0 20px;
			border: 1px solid #dcdfe6;
			border-right: 0;
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;
			border-radius: 4px;
			margin-top: -2px;
		}
</style>
