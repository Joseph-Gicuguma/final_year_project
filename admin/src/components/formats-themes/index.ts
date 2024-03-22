import FormatThemesList from './FormatThemesList.js';
import { FormatShow, ThemeShow } from './FormatThemeShow.js';
import FormatThemeCreate from './FormatThemeCreate.js';
import { FormatEdit, ThemeEdit } from './FormatThemeEdit.js';

export const formats = {
	list: FormatThemesList,
	show: FormatShow,
	create: FormatThemeCreate,
	edit: FormatEdit,
};

export const themes = {
	list: FormatThemesList,
	show: ThemeShow,
	create: FormatThemeCreate,
	edit: ThemeEdit,
};

