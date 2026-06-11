# Language

# Ruby Fundamentals

## Project Structure (Rails)

```
myapp/
├── app/
│   ├── controllers/
│   ├── models/
│   ├── services/
│   ├── views/
│   └── jobs/
├── config/
├── db/
│   └── migrate/
├── lib/
├── spec/ or test/
├── Gemfile
└── Gemfile.lock
```

## Naming Conventions

```ruby
# Classes/Modules: PascalCase
class UserService
end

module Authentication
end

# Methods/variables: snake_case
def create_user(email)
  user_name = "test"
end

# Constants: SCREAMING_SNAKE_CASE
MAX_RETRIES = 3
DEFAULT_TIMEOUT = 30

# Predicate methods: end with ?
def valid?
  @errors.empty?
end

# Dangerous methods: end with !
def save!
  raise Error unless save
end

# Private attr: prefix with _
attr_reader :_internal_state
```

## Idiomatic Ruby

```ruby
# Blocks
users.each do |user|
  puts user.name
end

# Short blocks with &:method
emails = users.map(&:email)
active = users.select(&:active?)

# Safe navigation
user&.profile&.avatar_url

# Default values
def greet(name = "World")
  "Hello, #{name}!"
end

# Keyword arguments
def create_user(email:, name: nil, role: :user)
  User.new(email: email, name: name, role: role)
end

# Multiple return values
def parse(input)
  [result, errors]
end

result, errors = parse(input)
```

## Error Handling

```ruby
# Begin/rescue/ensure
begin
  risky_operation
rescue NetworkError => e
  logger.error("Network failed: #{e.message}")
  retry if should_retry?
rescue StandardError => e
  logger.error("Unexpected error: #{e.message}")
  raise
ensure
  cleanup
end

# Custom errors
class NotFoundError < StandardError
  attr_reader :id

  def initialize(id)
    @id = id
    super("Not found: #{id}")
  end
end

# Inline rescue (use sparingly)
value = risky_call rescue default_value
```

## Collections

```ruby
# Map/Select/Reduce
emails = users.map { |u| u.email }
active = users.select { |u| u.active? }
total = orders.reduce(0) { |sum, o| sum + o.total }

# Chaining
users
  .select(&:active?)
  .map(&:email)
  .uniq
  .sort

# Hash operations
counts = users.group_by(&:department)
               .transform_values(&:count)

# Find
user = users.find { |u| u.id == target_id }
```

## Classes and Modules

```ruby
# Service object pattern
class CreateUser
  def initialize(repository:, notifier:)
    @repository = repository
    @notifier = notifier
  end

  def call(email:, name:)
    user = User.new(email: email, name: name)
    @repository.save(user)
    @notifier.welcome(user)
    user
  end
end

# Module for shared behavior
module Timestampable
  def created_at
    @created_at ||= Time.now
  end
end

class User
  include Timestampable
end
```

## Testing (RSpec)

```ruby
RSpec.describe UserService do
  let(:repository) { instance_double(UserRepository) }
  let(:service) { described_class.new(repository: repository) }

  describe "#create" do
    context "with valid email" do
      it "creates a user" do
        allow(repository).to receive(:save)

        user = service.create(email: "test@example.com")

        expect(user.email).to eq("test@example.com")
        expect(repository).to have_received(:save).with(user)
      end
    end

    context "with invalid email" do
      it "raises ValidationError" do
        expect { service.create(email: "invalid") }
          .to raise_error(ValidationError)
      end
    end
  end
end
```

## Rails Conventions

```ruby
# Controller
class UsersController < ApplicationController
  def create
    @user = User.new(user_params)
    if @user.save
      redirect_to @user, notice: "User created"
    else
      render :new, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:user).permit(:email, :name)
  end
end

# Model
class User < ApplicationRecord
  validates :email, presence: true, uniqueness: true
  has_many :posts, dependent: :destroy
  scope :active, -> { where(active: true) }
end
```


---

# Ruby Testing (RSpec)

## Project Structure

```
myapp/
├── app/
│   └── services/
│       └── user_service.rb
└── spec/
    ├── spec_helper.rb
    ├── rails_helper.rb        # Rails projects
    └── services/
        └── user_service_spec.rb
```

## Basic Specs

```ruby
RSpec.describe UserService do
  describe "#create" do
    it "creates a user with valid email" do
      service = UserService.new

      user = service.create(email: "test@example.com")

      expect(user.email).to eq("test@example.com")
    end

    it "raises error with invalid email" do
      service = UserService.new

      expect { service.create(email: "invalid") }
        .to raise_error(ValidationError)
    end
  end
end
```

## Let and Subject

```ruby
RSpec.describe UserService do
  subject(:service) { described_class.new(repository: repository) }
  let(:repository) { instance_double(UserRepository) }
  let(:user) { User.new(email: "test@example.com") }

  describe "#find" do
    before do
      allow(repository).to receive(:find).with("1").and_return(user)
    end

    it "returns the user" do
      result = service.find("1")
      expect(result).to eq(user)
    end
  end
end
```

## Matchers

```ruby
# Equality
expect(actual).to eq(expected)
expect(actual).not_to eq(unexpected)
expect(actual).to eql(expected)  # stricter equality

# Boolean
expect(value).to be true
expect(value).to be_truthy
expect(value).to be_falsy
expect(value).to be_nil

# Comparisons
expect(value).to be > 5
expect(value).to be_between(1, 10)

# Collections
expect(array).to include(item)
expect(array).to contain_exactly(1, 2, 3)
expect(array).to match_array([3, 1, 2])
expect(array).to be_empty
expect(hash).to have_key(:name)

# Strings
expect(string).to start_with("Hello")
expect(string).to end_with("World")
expect(string).to match(/pattern/)

# Types
expect(object).to be_a(User)
expect(object).to be_an_instance_of(User)

# Predicates (calls object.active?)
expect(user).to be_active
expect(user).to have_orders  # calls has_orders?
```

## Contexts and Shared Examples

```ruby
RSpec.describe UserService do
  describe "#create" do
    context "with valid email" do
      it "creates the user" do
        # test
      end

      it "sends welcome email" do
        # test
      end
    end

    context "with invalid email" do
      it "raises ValidationError" do
        # test
      end
    end
  end
end

# Shared examples
RSpec.shared_examples "a persisted entity" do
  it "has an id" do
    expect(entity.id).not_to be_nil
  end

  it "has timestamps" do
    expect(entity.created_at).not_to be_nil
  end
end

RSpec.describe User do
  let(:entity) { User.create(email: "test@example.com") }

  it_behaves_like "a persisted entity"
end
```

## Mocking and Stubbing

```ruby
RSpec.describe UserService do
  let(:repository) { instance_double(UserRepository) }
  let(:notifier) { instance_double(EmailNotifier) }
  let(:service) { described_class.new(repository: repository, notifier: notifier) }

  describe "#create" do
    it "saves user and sends notification" do
      user = User.new(email: "test@example.com")

      # Stubbing
      allow(repository).to receive(:save).and_return(user)
      allow(notifier).to receive(:welcome)

      result = service.create(email: "test@example.com")

      # Verification
      expect(repository).to have_received(:save).with(an_instance_of(User))
      expect(notifier).to have_received(:welcome).with(user)
    end

    it "raises when repository fails" do
      allow(repository).to receive(:save).and_raise(DatabaseError)

      expect { service.create(email: "test@example.com") }
        .to raise_error(DatabaseError)
    end
  end
end

# Partial doubles (real objects with stubbed methods)
RSpec.describe User do
  it "can stub specific methods" do
    user = User.new(email: "test@example.com")
    allow(user).to receive(:premium?).and_return(true)

    expect(user.premium?).to be true
  end
end
```

## Before/After Hooks

```ruby
RSpec.describe UserService do
  before(:all) do
    # Run once before all examples
    DatabaseCleaner.strategy = :transaction
  end

  before(:each) do
    # Run before each example
    DatabaseCleaner.start
  end

  after(:each) do
    # Run after each example
    DatabaseCleaner.clean
  end

  around(:each) do |example|
    # Wrap each example
    Timecop.freeze(Time.local(2024)) do
      example.run
    end
  end
end
```

## Testing Rails Controllers

```ruby
RSpec.describe UsersController, type: :controller do
  describe "POST #create" do
    context "with valid params" do
      it "creates a new user" do
        expect {
          post :create, params: { user: { email: "test@example.com" } }
        }.to change(User, :count).by(1)
      end

      it "redirects to the user" do
        post :create, params: { user: { email: "test@example.com" } }
        expect(response).to redirect_to(User.last)
      end
    end
  end
end
```

## Request Specs (API Testing)

```ruby
RSpec.describe "Users API", type: :request do
  describe "GET /api/users/:id" do
    let(:user) { User.create(email: "test@example.com") }

    it "returns the user" do
      get "/api/users/#{user.id}"

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)["email"]).to eq("test@example.com")
    end
  end
end
```

## Running Tests

```bash
# Run all specs
bundle exec rspec

# Run specific file
bundle exec rspec spec/services/user_service_spec.rb

# Run specific example
bundle exec rspec spec/services/user_service_spec.rb:15

# Run with tag
bundle exec rspec --tag integration

# Run with format
bundle exec rspec --format documentation
```
