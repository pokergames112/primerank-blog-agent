import 'dotenv/config';
import { SchedulerJob } from '../jobs/scheduler.js';
import { TrendsService } from '../services/trendsService.js';

async function main() {
  const args = process.argv.slice(2);
  const customTopic = args.join(' ');

  console.log('----------------------------------------------------');
  console.log('🤖 AGENTE DE CONTEÚDO PRIME RANK MARKETING (MANUAL)');
  console.log('----------------------------------------------------\n');

  const scheduler = SchedulerJob.getInstance();

  if (customTopic) {
    console.log(`[CLI] Gerando artigo aprofundado para a pauta personalizada: "${customTopic}"...`);
    const post = await scheduler.runTrendDiscoveryAndDrafting(customTopic);
    console.log(`\n✅ Post gerado com sucesso!`);
    console.log(`📌 Título: ${post?.title}`);
    console.log(`📝 Total de Palavras: ${post?.seo.wordCount}`);
    console.log(`🌐 Valide agora no painel: http://localhost:3000/dashboard\n`);
  } else {
    console.log(`[CLI] Coletando tendências do Google Trends Brasil...`);
    const trendsService = TrendsService.getInstance();
    const trends = await trendsService.fetchTrendingTopics();

    console.log(`\n🔥 Tendências encontradas no Google:`);
    trends.slice(0, 5).forEach((t, i) => {
      console.log(`  ${i + 1}. [${t.category}] ${t.title} (${t.approximateTraffic})`);
    });

    console.log(`\n[CLI] Criando artigo para a melhor tendência...`);
    const post = await scheduler.runTrendDiscoveryAndDrafting();
    console.log(`\n✅ Post gerado com sucesso!`);
    console.log(`📌 Título: ${post?.title}`);
    console.log(`📝 Total de Palavras: ${post?.seo.wordCount}`);
    console.log(`🌐 Valide agora no painel: http://localhost:3000/dashboard\n`);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error('[CLI] Erro:', err);
  process.exit(1);
});
