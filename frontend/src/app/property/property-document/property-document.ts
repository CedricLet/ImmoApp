import { Component, ViewChild, ElementRef, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FlatTreeControl} from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, map, startWith } from 'rxjs';
import { API_URL } from '../../constants';
import {Document, DocumentCategory} from '../document';
import {DocumentService} from '../document.service';
import { LabelFrPipe } from '../../i18n/label-fr.pipe';

type TreeNode = {
  name: string;
  icon?: string;
  documentCategory?: DocumentCategory;
  energyType?: Document['energyType'];
  children?: TreeNode[];
};

type FlatNode = {
  name: string;
  icon?: string;
  documentCategory? : DocumentCategory;
  energyType?: Document['energyType'];
  level: number;
  expandable: boolean;
}

const TREE_DATA: TreeNode[] = [
  {name: 'All documents', icon: 'folder_open'},
  {
    name: 'Works',
    icon: 'construction',
    documentCategory: DocumentCategory.WORK,
    children: [
      { name: 'Invoices', icon: 'receipt_long', documentCategory: DocumentCategory.INVOICE },
      { name: 'Contracts', icon: 'description', documentCategory: DocumentCategory.CONTRACT},
    ],
  },
  {
    name: 'Energy',
    icon: 'bolt',
    children: [
      {
        name: 'Electricity',
        icon: 'electric_bolt',
        documentCategory: DocumentCategory.INVOICE,
        energyType: 'ELECTRICITY',
        children: [
          {name: 'Contracts', icon: 'description', documentCategory: DocumentCategory.CONTRACT, energyType: 'ELECTRICITY'},
          {name: 'Invoices', icon: 'receipt_long', documentCategory: DocumentCategory.INVOICE, energyType: 'ELECTRICITY'},
        ],
      },
      {
        name: 'Gas',
        icon: 'local_fire_department',
        documentCategory: DocumentCategory.INVOICE,
        energyType: 'GAS',
        children: [
          { name: 'Contracts', icon: 'description', documentCategory: DocumentCategory.CONTRACT, energyType: 'GAS' },
          { name: 'Invoices', icon: 'receipt_long', documentCategory: DocumentCategory.INVOICE, energyType: 'GAS' },
        ],
      },
      {
        name: 'Water',
        icon: 'water_drop',
        documentCategory: DocumentCategory.INVOICE,
        energyType: 'WATER',
        children: [
          { name: 'Contracts', icon: 'description', documentCategory: DocumentCategory.CONTRACT, energyType: 'WATER' },
          { name: 'Invoices', icon: 'receipt_long', documentCategory: DocumentCategory.INVOICE, energyType: 'WATER' },
        ],
      },
      { name: 'District heating', icon: 'heat_pump', documentCategory: DocumentCategory.INVOICE, energyType: 'DISTRICT_HEATING' },
      { name: 'Fuel oil', icon: 'oil_barrel', documentCategory: DocumentCategory.INVOICE, energyType: 'FUEL_OIL' },
      { name: 'Wood pellets', icon: 'forest', documentCategory: DocumentCategory.INVOICE, energyType: 'WOOD_PELLETS' },
      { name: 'Solar PV', icon: 'solar_power', documentCategory: DocumentCategory.INVOICE, energyType: 'SOLAR_PV' },
    ],
  },
  {
    name: 'Syndic',
    icon: 'groups',
    children: [
      { name: 'Syndic reports', icon: 'article', documentCategory: DocumentCategory.OTHER },
      { name: 'Information', icon: 'info', documentCategory: DocumentCategory.OTHER },
    ],
  },
  { name: 'Insurance', icon: 'health_and_safety', documentCategory: DocumentCategory.INSURANCE },
  { name: 'Tax', icon: 'account_balance', documentCategory: DocumentCategory.TAX },
  { name: 'Contracts', icon: 'description', documentCategory: DocumentCategory.CONTRACT },
  { name: 'Invoices', icon: 'receipt_long', documentCategory: DocumentCategory.INVOICE },
  { name: 'PEB', icon: 'energy_savings_leaf', documentCategory: DocumentCategory.PEB },
  { name: 'Photos', icon: 'photo_library', documentCategory: DocumentCategory.PHOTO },
  { name: 'Other', icon: 'folder', documentCategory: DocumentCategory.OTHER },
];

@Component({
  selector: 'app-property-document',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    MatInputModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatDividerModule,
    MatPaginatorModule,
    LabelFrPipe,
  ],
  styles: [`
    .page { padding: 4rem 6rem; }
    .layout { display: grid; grid-template-columns: 280px 1fr 360px; gap: 1.5rem; align-items: start; }
    .card { border: 1px solid #e5e7eb; border-radius: .75rem; background: #fff; }
    .left, .right { padding: 1rem; position: sticky; top: 6rem; height: calc(100dvh - 8rem); overflow: auto; }
    .center { padding: 1rem; }
    .row { display: flex; align-items: center; }
    .col { display: flex; flex-direction: column; }
    .gap-1 { gap: .5rem; } .gap-2 { gap: 1rem; }
    .w-100 { width: 100%; }
    .doc { padding: .75rem 1rem; border: 1px solid #eee; border-radius: .5rem; }
    .doc:hover { background: #fafafa; }
    .muted { color: #6b7280; }
    .dropzone {
      border: 2px dashed #cbd5e1; border-radius: .75rem; padding: 1rem;
      text-align: center; cursor: pointer; transition: background .2s, border-color .2s;
    }
    .dropzone.dragover { background: #f8fafc; border-color: #94a3b8; }
    .chip-bar { flex-wrap: wrap; gap: .25rem; }
  `],
  template: `
    <div class="page">
      <div class="layout">
        <!-- LEFT: Tree -->
        <div class="left card">
          <div class="row gap-1" style="justify-content: space-between;">
            <span class="muted">Folders</span>
            <button mat-button (click)="resetFilters()">
              <mat-icon>refresh</mat-icon> Reset
            </button>
          </div>
          <mat-divider class="mb-2"></mat-divider>

          <mat-tree [dataSource]="dataSource" [treeControl]="treeControl" class="w-100">
            <!-- Expandable -->
            <mat-tree-node *matTreeNodeDef="let node; when: hasChild" matTreeNodeToggle>
              <button mat-icon-button matTreeNodeToggle>
                <mat-icon>{{ treeControl.isExpanded(node) ? 'expand_more' : 'chevron_right' }}</mat-icon>
              </button>
              <mat-icon class="muted" style="margin-right:.25rem">{{ node.icon || 'folder' }}</mat-icon>
              <span (click)="selectNode(node)" style="cursor:pointer">{{ node.name | labelFr:'tree' }}</span>
            </mat-tree-node>

            <!-- Leaf -->
            <mat-tree-node *matTreeNodeDef="let node">
              <button mat-icon-button disabled></button>
              <mat-icon class="muted" style="margin-right:.25rem">{{ node.icon || 'insert_drive_file' }}</mat-icon>
              <span (click)="selectNode(node)" style="cursor:pointer">{{ node.name | labelFr:'tree' }}</span>
            </mat-tree-node>
          </mat-tree>

        </div>

        <!-- CENTER: list + search -->
        <div class="center card col gap-2">
          <div class="row gap-2" style="justify-content: space-between;">
            <mat-form-field class="w-100" appearance="outline">
              <mat-label>Rechercher un document</mat-label>
              <mat-icon matPrefix>search</mat-icon>
              <input matInput [formControl]="searchCtrl" placeholder="nom du fichier, tag..." />
            </mat-form-field>

            <mat-form-field appearance="outline" style="min-width: 220px">
              <mat-label>Catégorie</mat-label>
              <mat-select [formControl]="categoryCtrl">
                <mat-option value="">Tous</mat-option>
                <mat-option *ngFor="let c of documentCategories" [value]="c">{{ c | labelFr:'category'}}</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <div class="row chip-bar">
            <mat-chip-row *ngFor="let t of selectedTags" (removed)="removeTag(t)">
              {{ t }}
              <button matChipRemove aria-label="remove tag">
                <mat-icon>cancel</mat-icon>
              </button>
            </mat-chip-row>

            <mat-form-field appearance="outline" style="min-width: 260px">
              <mat-label>Ajouter un tag</mat-label>
              <input type="text" matInput [matAutocomplete]="auto" [formControl]="tagInputCtrl" />
              <mat-autocomplete #auto="matAutocomplete" (optionSelected)="addTag($event.option.value)">
                <mat-option *ngFor="let opt of filteredTags$ | async" [value]="opt">{{ opt | labelFr:'tag' }}</mat-option>
              </mat-autocomplete>
            </mat-form-field>

            <button mat-stroked-button color="primary" (click)="loadDocs(true)">
              <mat-icon>filter_alt</mat-icon> Appliquer le filtre
            </button>
          </div>

          <mat-divider></mat-divider>

          <div class="col gap-1">
            <div *ngFor="let d of documents" class="doc row" style="justify-content: space-between;">
              <div class="row gap-2" style="align-items: center;">
                <mat-icon>picture_as_pdf</mat-icon>
                <div class="col">
                  <span class="muted">
                    {{ d.documentCategory | labelFr:'category'}} • {{ (d.sizeBytes/1024/1024) | number:'1.0-2' }} MB • {{ d.uploadedAt | date:'medium' }}
                    <ng-container *ngIf="d.energyType">• {{ d.energyType | labelFr:'energy' }}</ng-container>
                  </span>
                  <div class="row chip-bar muted">
                    <span *ngFor="let tg of d.tags" class="chip">#{{ tg | labelFr:'tag' }}</span>
                  </div>
                </div>
              </div>

              <div class="row gap-1">
                <a mat-stroked-button color="primary" [href]="API_URL + '/' + d.storagePath" target="_blank">
                  <mat-icon>open_in_new</mat-icon> Open
                </a>
                <button mat-stroked-button (click)="startEdit(d)">
                  <mat-icon>edit</mat-icon> Edit
                </button>
                <button mat-stroked-button color="warn" (click)="delete(d)">
                  <mat-icon>delete</mat-icon> Supprimer
                </button>
              </div>
            </div>

            <p *ngIf="!documents?.length" class="muted">Pas de document trouvé.</p>
          </div>

          <mat-paginator
            #paginator
            [length]="totalElements"
            [pageSize]="10"
            [pageIndex]="pageIndex"
            [showFirstLastButtons]="true"
            (page)="onPage($event)"
          ></mat-paginator>
        </div>

        <!-- RIGHT: upload / edit -->
        <div #rightPanel class="right card col gap-2">
          <span style="font-weight: 600;">Ajout/Modification document</span>

          <div class="dropzone"
               [class.dragover]="dragOver"
               (click)="fileInput.click()"
               (dragover)="onDragOver($event)"
               (dragleave)="onDragLeave($event)"
               (drop)="onDrop($event)">
            <input #fileInput type="file" accept="application/pdf" hidden (change)="onFileSelect($event)" />
            <mat-icon>cloud_upload</mat-icon>
            <div class="col">
              <b>Drag & drop un PDF ici</b>
              <span class="muted">ou clique pour sélectionner (max 15 MB)</span>
              <span class="muted" *ngIf="selectedFileName">Selected: {{ selectedFileName }}</span>
            </div>
          </div>

          <form class="col gap-1" [formGroup]="docForm">

            <mat-form-field appearance="outline">
              <mat-label>Catégorie</mat-label>
              <mat-select formControlName="category" required>
                <mat-option *ngFor="let c of documentCategories" [value]="c">{{ c | labelFr:'category' }}</mat-option>
              </mat-select>
            </mat-form-field>

            <!-- Energy type only if relevant -->
            <mat-form-field appearance="outline">
              <mat-label>Type d'énergie (optional)</mat-label>
              <mat-select formControlName="energyType">
                <mat-option [value]="null">Aucune</mat-option>
                <mat-option value="ELECTRICITY">{{ 'ELECTRICITY' | labelFr:'energy' }}</mat-option>
                <mat-option value="GAS">{{ 'GAS' | labelFr:'energy' }}</mat-option>
                <mat-option value="WATER">{{ 'WATER' | labelFr:'energy' }}</mat-option>
                <mat-option value="DISTRICT_HEATING">{{ 'DISTRICT_HEATING' | labelFr:'energy' }}</mat-option>
                <mat-option value="FUEL_OIL">{{ 'FUEL_OIL' | labelFr:'energy' }}</mat-option>
                <mat-option value="WOOD_PELLETS">{{ 'WOOD_PELLETS' | labelFr:'energy' }}</mat-option>
                <mat-option value="SOLAR_PV">{{ 'SOLAR_PV' | labelFr:'energy' }}</mat-option>
              </mat-select>
            </mat-form-field>

            <!-- Tags -->
            <div class="row chip-bar">
              <mat-chip-row *ngFor="let t of formTags" (removed)="removeFormTag(t)">
                {{ t }}
                <button matChipRemove aria-label="remove form tag">
                  <mat-icon>cancel</mat-icon>
                </button>
              </mat-chip-row>

              <mat-form-field appearance="outline" style="min-width: 240px">
                <mat-label>Ajout tag</mat-label>
                <input type="text" matInput [matAutocomplete]="auto2" [formControl]="formTagInputCtrl" />
                <mat-autocomplete #auto2="matAutocomplete" (optionSelected)="addFormTag($event.option.value)">
                  <mat-option *ngFor="let opt of filteredTagsForForm$ | async" [value]="opt">{{ opt | labelFr:'tag' }}</mat-option>
                </mat-autocomplete>
              </mat-form-field>
            </div>

            <div class="row gap-1" style="justify-content: space-between;">
              <button mat-button color="primary" (click)="submit()" [disabled]="!docForm.valid || !selectedFile && !editId">
                <mat-icon>save</mat-icon> {{ editId ? 'Save changes' : 'Upload' }}
              </button>
              <button mat-stroked-button (click)="resetForm()">
                <mat-icon>close</mat-icon> Clear
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class PropertyDocumentComponent {
  private http = inject(HttpClient);
  private svc = inject(DocumentService);
  private fb = inject(FormBuilder);
  private snack = inject(MatSnackBar);

  protected readonly API_URL = API_URL;

  // ===== Tree control
  private _transformer = (node: TreeNode, level: number): FlatNode => ({
    name: node.name,
    icon: node.icon,
    documentCategory: node.documentCategory,
    energyType: node.energyType,
    level,
    expandable: !!node.children && node.children.length > 0,
  });

  treeControl = new FlatTreeControl<FlatNode>(
    n => n.level,
    n => n.expandable
  );

  treeFlattener = new MatTreeFlattener<TreeNode, FlatNode>(
    this._transformer,
    n => n.level,
    n => n.expandable,
    n => n.children ?? []
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: FlatNode) => node.expandable;

  // ===== Filters / listing
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  searchCtrl = new FormControl<string>('', { nonNullable: true });
  categoryCtrl = new FormControl<DocumentCategory | ''>('');
  tagInputCtrl = new FormControl<string>('');
  selectedTags: string[] = [];
  filteredTags$!: Observable<string[]>;
  documents: Document[] = [];
  totalElements = 0;
  pageIndex = 0;

  // ===== Upload / edit form
  dragOver = false;
  selectedFile: File | null = null;
  selectedFileName = '';
  readonly MAX_MB = 15;

  docForm = this.fb.group({
    category: ['', Validators.required],
    energyType: [null as Document['energyType']],
    tags: [[] as string[]],
  });

  get formTags() { return this.docForm.get('tags')?.value ?? []; }
  formTagInputCtrl = new FormControl<string>('');
  filteredTagsForForm$!: Observable<string[]>;
  allTagNames: string[] = [];

  // edit state
  editId: number | null = null;

  ngOnInit() {
    this.dataSource.data = TREE_DATA;
    // Charger liste de tags (seed)
    this.svc.getAllTags().subscribe({
      next: (tags) => {
        this.allTagNames = (tags ?? []).map(t => t.name).sort();
        this.setupTagFilters();
      },
      error: () => {
        this.allTagNames = []; // fallback
        this.setupTagFilters();
      }
    });

    // recharger quand recherche / catégorie changent
    this.searchCtrl.valueChanges.pipe(startWith('')).subscribe(() => this.loadDocs(true));
    this.categoryCtrl.valueChanges.subscribe(() => this.loadDocs(true));

    // initial
    this.loadDocs(true);
  }

  private setupTagFilters() {
    this.filteredTags$ = this.tagInputCtrl.valueChanges.pipe(
      startWith(''),
      map(v => (v || '').toString().toUpperCase()),
      map(val => this.allTagNames.filter(t => t.toUpperCase().includes(val) && !this.selectedTags.includes(t)))
    );
    this.filteredTagsForForm$ = this.formTagInputCtrl.valueChanges.pipe(
      startWith(''),
      map(v => (v || '').toString().toUpperCase()),
      map(val => this.allTagNames.filter(t => t.toUpperCase().includes(val) && !this.formTags.includes(t)))
    );
  }

  documentCategories: DocumentCategory[] = Object.values(DocumentCategory) as DocumentCategory[];

  loadDocs(reset = false) {
    if (reset) { this.pageIndex = 0; this.paginator?.firstPage(); }

    const params = {
      page: this.pageIndex,
      search: this.searchCtrl.value || '',
      documentCategory: (this.categoryCtrl.value || '') as DocumentCategory | '',
      energyType: '', // set via tree selection (voir selectNode)
      tags: this.selectedTags,
      // propertyId: <si besoin>
    };

    this.svc.listDocuments(params).subscribe({
      next: (res) => {
        this.documents = res.content;
        this.totalElements = res.totalElements;
      },
      error: () => {
        this.documents = [];
        this.totalElements = 0;
      }
    });
  }

  onPage(e: PageEvent) {
    this.pageIndex = e.pageIndex;
    this.loadDocs();
  }

  // ===== Tree selection -> remplit category / energyType filters
  private currentEnergyType: Document['energyType'] = null;

  selectNode(node: TreeNode) {
    // maj filtres
    this.categoryCtrl.setValue(node.documentCategory || '');
    this.currentEnergyType = node.energyType ?? null;

    // recharge avec energyType
    const params = {
      page: 0,
      search: this.searchCtrl.value || '',
      documentCategory: (this.categoryCtrl.value || '') as DocumentCategory | '',
      energyType: this.currentEnergyType || '',
      tags: this.selectedTags,
    };
    this.pageIndex = 0;
    this.svc.listDocuments(params).subscribe({
      next: (res) => {
        this.documents = res.content;
        this.totalElements = res.totalElements;
        this.paginator?.firstPage();
      },
      error: () => {
        this.documents = [];
        this.totalElements = 0;
      }
    });
  }

  resetFilters() {
    this.searchCtrl.setValue('');
    this.categoryCtrl.setValue('');
    this.selectedTags = [];
    this.currentEnergyType = null;
    this.loadDocs(true);
  }

  // ===== Tag filter bar (center)
  addTag(tagName: string) {
    if (!this.selectedTags.includes(tagName)) this.selectedTags.push(tagName);
    this.tagInputCtrl.setValue('');
  }
  removeTag(tagName: string) {
    this.selectedTags = this.selectedTags.filter(t => t !== tagName);
  }

  // ===== Upload / Edit
  @HostListener('window:paste', ['$event'])
  onPaste(ev: ClipboardEvent) {
    const itemList = ev.clipboardData?.items as DataTransferItemList | undefined;
    if (!itemList) return;

    for (let i = 0; i < itemList.length; i++) {
      const it = itemList[i];
      // on s'assure que c'est bien un fichier
      const f = it.kind === 'file' ? it.getAsFile() : null;
      if (f && f.type === 'application/pdf') {
        this.useSelectedFile(f);
        break;
      }
    }
  }


  onFileSelect(ev: any) {
    const file: File | null = ev.target?.files?.[0] ?? null;
    if (file) this.useSelectedFile(file);
  }

  onDragOver(e: DragEvent) { e.preventDefault(); this.dragOver = true; }
  onDragLeave(e: DragEvent) { e.preventDefault(); this.dragOver = false; }
  onDrop(e: DragEvent) {
    e.preventDefault();
    this.dragOver = false;
    const file = e.dataTransfer?.files?.[0] ?? null;
    if (file) this.useSelectedFile(file);
  }

  private useSelectedFile(file: File) {
    if (file.type !== 'application/pdf') {
      this.snack.open('Seul les PDF sont authorisé.', 'Fermer'); return;
    }
    const sizeMB = file.size / 1024 / 1024;
    if (sizeMB > this.MAX_MB) {
      this.snack.open(`Le fichier est trop grand (${sizeMB.toFixed(2)} MB). Max ${this.MAX_MB} MB.`, 'Fermer'); return;
    }
    this.selectedFile = file;
    this.selectedFileName = file.name;
  }

  get formTagsCtrl() { return this.docForm.get('tags') as FormControl<string[]>; }

  addFormTag(tagName: string) {
    const next = [...this.formTags, tagName];
    this.formTagsCtrl.setValue(next);
    this.formTagInputCtrl.setValue('');
  }
  removeFormTag(tagName: string) {
    const next = this.formTags.filter(t => t !== tagName);
    this.formTagsCtrl.setValue(next);
  }

  @ViewChild('rightPanel') rightPanel!: ElementRef<HTMLDivElement>;

  startEdit(d: Document) {
    this.editId = d.id;
    this.selectedFile = null;
    this.selectedFileName = '';
    this.docForm.patchValue({
      category: d.documentCategory,
      energyType: d.energyType ?? null,
      tags: d.tags || [],
    });
    // scroll to form
    setTimeout(() => this.rightPanel?.nativeElement.scrollTo({ top: 0, behavior: 'smooth' }), 0);
  }

  submit() {
    if (this.editId) {
      // UPDATE (métadonnées, pas de remplacement de fichier dans ce flux-là)
      const body: Partial<Document> = {
        documentCategory: this.docForm.value.category as DocumentCategory,
        energyType: (this.docForm.value.energyType ?? null) as any,
        tags: this.formTags,
      };
      this.svc.updateDocument(this.editId, body).subscribe({
        next: () => {
          this.snack.open('Document modifié.', 'Fermer');
          this.resetForm();
          this.loadDocs();
        },
        error: () => this.snack.open('Erreur lors de la modification.', 'Fermer')
      });
      return;
    }

    // CREATE (upload)
    if (!this.selectedFile) {
      this.snack.open('Svp sélectionnez un PDF.', 'Fermer'); return;
    }
    const fd = new FormData();
    fd.append('file', this.selectedFile);
    fd.append('category', String(this.docForm.value.category));
    fd.append('energyType', String(this.docForm.value.energyType ?? ''));
    fd.append('tags', (this.formTags || []).join(','));
    // si tu veux lier à un bien précis:
    // fd.append('propertyId', String(this.currentPropertyId));

    this.svc.uploadDocument(fd).subscribe({
      next: () => {
        this.snack.open('Document modifié.', 'Fermer');
        this.resetForm();
        this.loadDocs(true);
      },
      error: () => this.snack.open('Modification échouée.', 'Fermer'),
    });
  }

  delete(d: Document) {
    if (!confirm('Supprimer ce document?')) return;
    this.svc.deleteDocument(d.id).subscribe({
      next: () => { this.snack.open('Document supprimé.', 'Fermer'); this.loadDocs(); },
      error: () => this.snack.open('Suppression échouée.', 'Fermé'),
    });
  }

  resetForm() {
    this.editId = null;
    this.selectedFile = null;
    this.selectedFileName = '';
    this.docForm.reset({ category: '', energyType: null, tags: [] });
  }
}
