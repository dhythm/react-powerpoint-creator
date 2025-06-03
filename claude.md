# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# PowerPoint プレゼンテーション作成システム

## プロジェクト概要
React.jsベースのプレゼンテーション資料プレビュー・PowerPoint生成システムを構築します。スライドマスター機能を含む本格的なプレゼンテーションツールの作成が目標です。

## 技術スタック
- **フロントエンド**: React.js + TypeScript
- **UI ライブラリ**: Material-UI または Tailwind CSS
- **PowerPoint 生成**: pptxgenjs
- **プレビュー機能**: HTML5 Canvas または React コンポーネント
- **ファイル処理**: File API, Blob API
- **状態管理**: React Context API または Redux Toolkit

## 主要機能要件

### 1. スライド編集機能
- テキスト、画像、図形の挿入・編集
- フォント、色、サイズの調整
- レイアウトの自由配置
- アニメーション効果の設定

### 2. スライドマスター機能
- マスタースライドの作成・編集
- 複数のレイアウトテンプレート
- 統一されたデザインテーマの適用
- プレースホルダーの配置と管理

### 3. プレビュー機能
- リアルタイムプレビュー
- スライドショーモード
- 印刷プレビュー
- レスポンシブ表示

### 4. PowerPoint エクスポート
- .pptx形式での出力
- スライドマスター情報の保持
- フォーマットの完全再現
- 高品質な画像出力

## ディレクトリ構造
```
powerpoint-creator/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Editor/
│   │   │   ├── SlideEditor.tsx
│   │   │   ├── TextEditor.tsx
│   │   │   ├── ImageEditor.tsx
│   │   │   └── ShapeEditor.tsx
│   │   ├── Preview/
│   │   │   ├── SlidePreview.tsx
│   │   │   ├── ThumbnailView.tsx
│   │   │   └── PresentationMode.tsx
│   │   ├── SlideMaster/
│   │   │   ├── MasterEditor.tsx
│   │   │   ├── LayoutManager.tsx
│   │   │   └── ThemeSelector.tsx
│   │   ├── Toolbar/
│   │   │   ├── MainToolbar.tsx
│   │   │   ├── FormatToolbar.tsx
│   │   │   └── ShapeToolbar.tsx
│   │   └── Export/
│   │       ├── PowerPointExporter.tsx
│   │       └── PreviewDialog.tsx
│   ├── hooks/
│   │   ├── useSlideManager.ts
│   │   ├── useSlideMaster.ts
│   │   └── usePowerPointExport.ts
│   ├── types/
│   │   ├── slide.types.ts
│   │   ├── master.types.ts
│   │   └── export.types.ts
│   ├── utils/
│   │   ├── pptxGenerator.ts
│   │   ├── slideRenderer.ts
│   │   └── fileHelpers.ts
│   ├── styles/
│   │   ├── global.css
│   │   └── components.css
│   ├── App.tsx
│   └── index.tsx
├── package.json
├── tsconfig.json
└── README.md
```

## 実装フェーズ

### Phase 1: 基本構造の構築
- React プロジェクトのセットアップ
- 基本的なUI レイアウトの作成
- スライド管理の基本機能
- 簡単なテキスト編集機能

### Phase 2: スライドマスター機能
- マスタースライドエディターの実装
- レイアウトテンプレートシステム
- テーマ管理機能
- プレースホルダーシステム

### Phase 3: 高度な編集機能
- 画像・図形挿入機能
- 詳細なフォーマット機能
- アニメーション効果
- レイヤー管理

### Phase 4: プレビューとエクスポート
- リアルタイムプレビュー機能
- PowerPoint エクスポート機能
- 品質チェック機能
- パフォーマンス最適化

## 重要な技術的考慮事項

### PowerPoint生成ライブラリ
```javascript
// pptxgenjs を使用した基本的な実装例
import PptxGenJS from 'pptxgenjs';

const generatePowerPoint = (slides, masterLayout) => {
  const pptx = new PptxGenJS();
  
  // スライドマスターの設定
  pptx.defineSlideMaster({
    title: 'MASTER_SLIDE',
    background: masterLayout.background,
    objects: masterLayout.placeholders
  });
  
  // 各スライドの生成
  slides.forEach(slideData => {
    const slide = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
    // スライド内容の追加
  });
  
  return pptx.writeFile('presentation.pptx');
};
```

### スライドマスター管理
- マスターレイアウトの保存・読み込み
- プレースホルダーの動的配置
- テーマカラーの一括適用
- フォント設定の継承

### パフォーマンス最適化
- 仮想スクロールによる大量スライド対応
- 画像の遅延読み込み
- Canvas レンダリングの最適化
- メモリ使用量の管理

## セキュリティとプライバシー
- ファイルはローカル処理のみ
- 外部サーバーへのデータ送信なし
- ブラウザストレージの適切な使用
- ファイルアップロードの検証

## テスト戦略
- コンポーネント単体テスト（Jest + React Testing Library）
- PowerPoint生成機能の統合テスト
- ブラウザ互換性テスト
- パフォーマンステスト

## デプロイメント
- 静的サイトホスティング（Netlify, Vercel等）
- PWA対応でオフライン使用可能
- CDN活用による高速配信

## 開発開始時の最初のタスク
1. React + TypeScript プロジェクトの初期化
2. 必要なライブラリのインストール（pptxgenjs, material-ui等）
3. 基本的なレイアウトコンポーネントの作成
4. スライド データ構造の定義
5. 簡単なプレビュー機能の実装

このシステムにより、WebブラウザでPowerPointプレゼンテーションを作成・編集し、スライドマスター機能を活用した統一感のあるプロフェッショナルな資料を生成できます。

## 開発コマンド

### プロジェクト初期化（まだ実行されていない場合）
```bash
# React + TypeScript プロジェクトの作成
npx create-react-app . --template typescript

# 必要なライブラリのインストール
npm install pptxgenjs
npm install @mui/material @emotion/react @emotion/styled  # Material-UI を使用する場合
# または
npm install -D tailwindcss postcss autoprefixer  # Tailwind CSS を使用する場合
```

### 開発サーバー
```bash
npm start  # 開発サーバーの起動（http://localhost:3000）
```

### ビルド
```bash
npm run build  # プロダクション用ビルドの作成
```

### テスト
```bash
npm test  # テストの実行（インタラクティブモード）
npm test -- --coverage  # カバレッジレポート付きテスト
npm test -- --watchAll=false  # CI環境用の単発テスト実行
```

### 品質チェック
```bash
npm run lint  # ESLintによるコード品質チェック（設定後）
npm run typecheck  # TypeScriptの型チェック（tsc --noEmit）
```

## アーキテクチャ概要

### データフロー
1. **スライドデータ管理**: React Context API または Redux でグローバル状態管理
2. **スライドマスター**: 独立したコンテキストでマスターレイアウトを管理
3. **プレビュー**: スライドデータをリアルタイムでCanvas/HTMLにレンダリング
4. **エクスポート**: pptxgenjsでスライドデータをPowerPoint形式に変換

### 主要インターフェース
```typescript
// スライドの基本構造
interface Slide {
  id: string;
  masterId: string;
  elements: SlideElement[];
  animations?: Animation[];
}

// スライドマスターの構造
interface SlideMaster {
  id: string;
  name: string;
  layouts: MasterLayout[];
  theme: Theme;
}
```

### pptxgenjs統合パターン
- スライドマスターは`defineSlideMaster`で事前定義
- 各スライドは対応するマスターレイアウトを参照
- エレメント（テキスト、画像、図形）は座標系の変換を経てpptxgenjsのAPIに渡される

### 状態管理の考慮事項
- プレゼンテーション全体の状態（スライド配列、選択中のスライド等）
- 編集中の要素の一時的な状態
- アンドゥ/リドゥのための履歴管理
- エクスポート時の進捗状態