import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import SuccessText from '../components/SuccessText';
import { Link } from 'react-router-dom';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const EditPage: React.FunctionComponent<RouteComponentProps<any>> = props => {
    const [_id, setId] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [picture, setPicture] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [headline, setHeadline] = useState<string>('');
    const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty());

    const [saving, setSaving] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [success, setSuccess] = useState<string>('');
    const [error, setError] = useState<string>('');

    
 

  

    const createBlog = async () => {
        if (title === '' || headline === '' || content === '')
        {
            setError('Please fill out all fields.');
            setSuccess('');
            return null;
        }

        setError('');
        setSuccess('');
        setSaving(true);

        try 
        {
            const response = await axios({
                method: 'POST',
                url: `${config.server.url}/blogs/create`,
                data: {
                    title,
                    picture,
                    headline,
                    content,
                    author: user._id
                }
            });

            if (response.status === 201)
            {
                setId(response.data.blog._id);
                setSuccess('Blog posted.  You can continue to edit on this page.');
            }
            else
            {
                setError(`Unable to save blog.`);
            }
        } 
        catch (error) 
        {
            setError(error.message);
        }
        finally
        {
            setSaving(false);
        }
    }

    const editBlog = async () => {
        if (title === '' || headline === '' || content === '')
        {
            setError('Please fill out all fields.');
            setSuccess('');
            return null;
        }

        setError('');
        setSuccess('');
        setSaving(true);
        
        try 
        {
            const response = await axios({
                method: 'PATCH',
                url: `${config.server.url}/blogs/update/${_id}`,
                data: {
                    title,
                    picture,
                    headline,
                    content
                }
            });

            if (response.status === 201)
            {
                setSuccess('Blog updated.');
            }
            else
            {
                setError(`Unable to save blog.`);
            }
        } 
        catch (error) 
        {
            setError(error.message);
        }
        finally
        {
            setSaving(false);
        }
    }

    if (loading) return <LoadingComponent />;

    return (
        <Container fluid className="p-0">
            <Navigation />
            <Header
                image="https://startbootstrap.github.io/startbootstrap-clean-blog/img/home-bg.jpg"
                headline=""
                title={_id !== '' ? 'Edit Your Blog' : 'Create a Blog'}
            />
            <Container className="mt-5 mb-5">
                <ErrorText error={error} />
                <Form>
                    <FormGroup>
                        <Label for="title">Title</Label>
                        <Input 
                            type="text" 
                            name="title"
                            value={title} 
                            id="title"
                            placeholder="Enter a title"
                            disabled={saving}
                            onChange={event => {
                                setTitle(event.target.value);
                            }}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="picture">Picture URL</Label>
                        <Input 
                            type="text" 
                            name="picture"
                            value={picture}
                            id="picture"
                            placeholder="Picture URL"
                            disabled={saving}
                            onChange={event => {
                                setPicture(event.target.value);
                            }}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="headline">Headline</Label>
                        <Input 
                            type="text" 
                            name="headline"
                            value={headline} 
                            id="headline"
                            placeholder="Enter a headline" 
                            disabled={saving}
                            onChange={event => {
                                setHeadline(event.target.value);
                            }}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Content</Label>
                        <Editor
                            editorState={editorState}
                            wrapperClassName="card"
                            editorClassName="card-body"
                            onEditorStateChange={newState => {
                                setEditorState(newState);
                                setContent(draftToHtml(convertToRaw(newState.getCurrentContent())));
                            }}
                            toolbar={{
                                options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'history', 'embedded', 'emoji', 'image'],
                                inline: { inDropdown: true },
                                list: { inDropdown: true },
                                textAlign: { inDropdown: true },
                                link: { inDropdown: true },
                                history: { inDropdown: true },
                            }}
                        />
                    </FormGroup>
                    <FormGroup>
                        <SuccessText success={success} />
                    </FormGroup>
                    <FormGroup>
                        <Button
                            block
                            onClick={() => {
                                if (_id !== '')
                                {
                                    editBlog();
                                }
                                else
                                {
                                    createBlog();
                                }
                            }}
                            disabled={saving}
                        >
                            <i className="fas fa-save mr-1"></i> 
                            {_id !== '' ?
                                "Update"
                            :
                                "Post"
                            }
                        </Button>
                        {_id !== '' &&
                            <Button block color="success" tag={Link} to={`/blogs/${_id}`}>
                                Go to your blog post!
                            </Button>
                        }
                    </FormGroup>
                    <FormGroup>
                        <Label>Preview</Label>
                        <div className="border ql-container p-2">
                            <div 
                                dangerouslySetInnerHTML={{ 
                                    __html: content
                                }} 
                            />
                        </div>
                    </FormGroup>
                </Form>
                <ErrorText error={error} />
            </Container>
        </Container>
    )
}

export default withRouter(EditPage);