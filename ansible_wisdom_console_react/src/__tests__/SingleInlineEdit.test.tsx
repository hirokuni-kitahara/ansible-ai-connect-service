import {render, screen} from "@testing-library/react";
import "@testing-library/jest-dom";
import {SingleInlineEdit} from "../SingleInlineEdit";
import userEvent from "@testing-library/user-event";

describe('SingleInlineEdit',
    () => {

        it('OnRender',
            async () => {
                render(<SingleInlineEdit value={'test-value'}
                                         aria-label={'test-aria-label'}
                                         isDisabled={false}
                                         placeholder={'test-placeholder'}/>);
                const textInputElement = screen.getByTestId("model-settings-editor__input");
                expect(textInputElement).toBeInTheDocument();
                expect(textInputElement).toHaveAttribute('type', 'text');
                expect(textInputElement).toHaveAttribute('value', 'test-value');
                expect(textInputElement).toHaveAttribute('aria-label', 'test-aria-label');
                expect(textInputElement).toHaveAttribute('placeholder', 'test-placeholder');
                expect(textInputElement).not.toBeDisabled();
                const clearButtonElement = screen.getByTestId("model-settings-editor__clear-button");
                expect(clearButtonElement).toBeInTheDocument();
                expect(clearButtonElement).toHaveAttribute('aria-label', 'ClearText');
                expect(clearButtonElement).toHaveAttribute('title', 'ClearText');
                expect(clearButtonElement).not.toBeDisabled();
            });

        it('OnTextChange',
            async () => {
                const callback = jest.fn();
                render(<SingleInlineEdit aria-label={'test-aria-label'} value={'test-value'} onChange={callback}/>);
                const textInputElement = screen.getByTestId("model-settings-editor__input");
                expect(textInputElement).toBeInTheDocument();
                expect(textInputElement).toHaveAttribute('value', 'test-value');
                await userEvent.type(textInputElement, '2');
                expect(callback).toBeCalledWith('test-value2');
            });

        it('OnClearButtonClick',
            async () => {
                const callback = jest.fn();
                render(<SingleInlineEdit aria-label={'test-aria-label'} value={'test-value'} onChange={callback}/>);
                const textInputElement = screen.getByTestId("model-settings-editor__input");
                expect(textInputElement).toBeInTheDocument();
                expect(textInputElement).toHaveAttribute('value', 'test-value')
                const clearButtonElement = screen.getByTestId("model-settings-editor__clear-button");
                expect(clearButtonElement).toBeInTheDocument();
                await userEvent.click(clearButtonElement);
                expect(callback).toBeCalledWith('');
            });

        it('OnRenderDisabled',
            async () => {
                const callback = jest.fn();
                render(<SingleInlineEdit aria-label={'test-aria-label'} value={'test-value'} onChange={callback} isDisabled={true}/>);
                const textInputElement = screen.getByTestId("model-settings-editor__input");
                expect(textInputElement).toBeInTheDocument();
                expect(textInputElement).toHaveAttribute('value', 'test-value');
                const clearButtonElement = screen.getByTestId("model-settings-editor__clear-button");
                expect(clearButtonElement).toBeDisabled();
            });
    });
