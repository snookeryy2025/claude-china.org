const statuses = { beta:'测试版', ga:'正式可用', preview:'预览版', 'research-preview':'研究预览版' };
export function FeatureSummary({ metadata }) {
  if (!metadata) return null;
  const { topic, status, betaHeader, supportedModels = [], supportedPlatforms = {}, zdr } = metadata;
  return <section className="feature-summary" aria-label="功能概览"><header><strong>{topic?.title || '功能概览'}</strong>{status && <span>{statuses[status] || status}</span>}</header><dl>
    {!!supportedModels.length && <><dt>支持的模型</dt><dd>{supportedModels.length > 15 ? '所有模型' : <details><summary>{supportedModels.length} 款模型</summary><ul>{supportedModels.map(model=><li key={model}><code>{model}</code></li>)}</ul></details>}</dd></>}
    {!!Object.keys(supportedPlatforms).length && <><dt>云平台</dt><dd><ul>{Object.entries(supportedPlatforms).filter(([,value])=>value!==false && value!=='not-supported').map(([platform])=><li key={platform}>✓ {platform.replace('(Anthropic managed)','（Anthropic 托管）').replace('(Google managed)','（Google 托管）')}</li>)}</ul></dd></>}
    {betaHeader && <><dt>Beta 请求头</dt><dd><code>{betaHeader}</code></dd></>}
    {zdr?.eligibility && <><dt>数据处理</dt><dd title={zdr.note}>{zdr.eligibility === 'eligible' ? '支持零数据保留' : zdr.eligibility === 'qualified' ? '有条件支持零数据保留' : '不支持零数据保留'}</dd></>}
  </dl></section>;
}
