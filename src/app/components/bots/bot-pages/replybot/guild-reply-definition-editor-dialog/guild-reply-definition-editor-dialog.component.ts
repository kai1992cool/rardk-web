import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { GuildReplyDefinition } from 'src/app/models/bots/replybot/guild-reply-definition';
import { GuildReplyDefinitionEditorDialogData } from 'src/app/models/bots/replybot/guild-reply-definition-editor-dialog-data';
import { HelpDialogComponent } from './help-dialog/help-dialog/help-dialog.component';
import emojiRegex from 'emoji-regex';

@Component({
  selector: 'app-guild-reply-definition-editor-dialog',
  templateUrl: './guild-reply-definition-editor-dialog.component.html',
  styleUrls: ['./guild-reply-definition-editor-dialog.component.scss'],
})
export class GuildReplyDefinitionEditorDialogComponent {
  public dialogData: GuildReplyDefinitionEditorDialogData;

  public isActive: boolean;
  public triggers: string[];
  public replies: string[];
  public mentionAuthor: boolean;
  public requiresBotName: boolean;
  public channelIds: string[];
  public userIds: string[];
  public reactions: string[];
  public maxReplyLength: number = 1800;
  public forbiddenTermErrorMessage: string =
    'There is a forbidden term present in this field.';
  public invalidEmojiErrorMessage: string =
    'A reaction must be one (1) valid emoji (custom emoji are not supported yet).';
  public invalidIdErrorMessage: string = 'An ID must be a valid number.';

  public forbiddenTerms: string[] = [
    'HowLongToBeat',
    'DefineWord',
    'FortniteShopInfo',
    'Poll',
  ];

  constructor(
    public dialogRef: MatDialogRef<GuildReplyDefinitionEditorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: GuildReplyDefinitionEditorDialogData,
    public helpDialog: MatDialog
  ) {
    this.dialogData = data;
    this.initializeEditor();
  }

  trackByFn(index: number, item: any) {
    return index;
  }

  addTrigger() {
    this.triggers.push('');
  }

  removeTrigger(index: number) {
    this.triggers.splice(index, 1);
  }

  addReply() {
    this.replies.push('');
  }

  removeReply(index: number) {
    this.replies.splice(index, 1);
  }

  addReaction() {
    this.reactions.push('');
  }

  removeReaction(index: number) {
    this.reactions.splice(index, 1);
  }

  addChannelId() {
    this.channelIds.push('');
  }

  removeChannelId(index: number) {
    this.channelIds.splice(index, 1);
  }

  addUserId() {
    this.userIds.push('');
  }

  removeUserId(index: number) {
    this.userIds.splice(index, 1);
  }

  cancelEdit() {
    this.closeDialog();
  }

  isSaveEnabled(): boolean {
    return (
      this.triggers.length > 0 &&
      this.triggers.filter((t) => t.trim() !== '').length > 0 &&
      !!!this.triggers.find((t) => this.hasForbiddenTerm(t)) &&
      !!!this.replies.find((t) => this.hasForbiddenTerm(t)) &&
      !!!this.reactions.find((reaction) => !this.isValidSingleEmoji(reaction))
    );
  }

  isValidSingleEmoji(input: string) {
    const regex = emojiRegex();
    const matches = input.trim().match(regex);
    return input.trim() === '' || matches?.[0].length === input.trim().length;
  }

  isValidId(input: string) {
    return !isNaN(+input.trim());
  }

  hasForbiddenTerm(textToCheck: string) {
    const foundForbiddenTerms = this.forbiddenTerms.filter((t) => {
      return textToCheck.toLowerCase().includes(`{{${t.toLowerCase()}}}`);
    });
    return foundForbiddenTerms.length > 0;
  }

  saveEdit() {
    let triggersCleaned = this.removeEmptyStringsAndTrim(this.triggers);
    let repliesCleaned = this.removeEmptyStringsAndTrim(this.replies);
    let channelIdsCleaned = this.removeEmptyStringsAndTrim(this.channelIds);
    let userIdsCleaned = this.removeEmptyStringsAndTrim(this.userIds);
    let reactionsCleaned = this.cleanReactions(this.reactions);

    const savedObject = {
      id: this.dialogData?.id,
      guildId: this.dialogData?.guildId,
      triggers: triggersCleaned,
      replies: repliesCleaned,
      mentionAuthor: this.mentionAuthor,
      requiresBotName: this.requiresBotName,
      channelIds: channelIdsCleaned,
      userIds: userIdsCleaned,
      reactions: reactionsCleaned,
      isActive: this.isActive,
      editingUserId: this.dialogData?.user?.id,
      editingUsername: this.dialogData?.user?.username,
    } as GuildReplyDefinition;
    this.closeDialog(savedObject);
  }

  removeEmptyStringsAndTrim(replies: string[]): string[] {
    return replies.filter((r) => r.trim() !== '').map((r) => r.trim());
  }

  cleanReactions(reactions: string[]) {
    const trimmedReactionsWithoutEmpty =
      this.removeEmptyStringsAndTrim(reactions);

    let reactionsWithoutDuplicates: string[] = [];

    trimmedReactionsWithoutEmpty.forEach((reaction) => {
      if (!reactionsWithoutDuplicates.includes(reaction)) {
        reactionsWithoutDuplicates.push(reaction);
      }
    });
    return reactionsWithoutDuplicates;
  }

  closeDialog(savedObject?: GuildReplyDefinition) {
    this.dialogRef.close(savedObject);
  }

  private initializeEditor() {
    this.triggers = this.dialogData?.triggers?.map((t) => t) ?? [];
    this.replies = this.dialogData?.replies?.map((r) => r) ?? [];
    this.mentionAuthor = this.dialogData?.mentionAuthor ?? false;
    this.requiresBotName = this.dialogData?.requiresBotName ?? false;
    this.reactions = this.dialogData?.reactions?.map((r) => r) ?? [];
    this.channelIds = this.dialogData?.channelIds?.map((r) => r) ?? [];
    this.userIds = this.dialogData?.userIds?.map((r) => r) ?? [];
    this.isActive = this.dialogData?.isActive ?? false;
  }

  openHelpDialog() {
    this.helpDialog.open(HelpDialogComponent, {
      height: '600px',
      width: '600px',
      disableClose: false,
      hasBackdrop: true,
    });
  }
}
