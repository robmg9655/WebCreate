import { LayoutSchema } from '../layoutSchema';

const sample = {
  id: 'test-1',
  title: 'Test',
  sections: ['hero', 'services', 'gallery']
};

try {
  const val = LayoutSchema.parse(sample);
  console.log('Layout test passed', val.id);
} catch (e) {
  console.error('Layout test failed', e);
  process.exit(1);
}
